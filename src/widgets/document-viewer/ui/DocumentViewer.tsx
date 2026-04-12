import { useMemo, useState, useRef } from 'react'
import DOMPurify from 'dompurify'
import {
  Table,
  Image,
  Code,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import type { DocumentResult } from '@/shared/types'
import {
  parseDocumentContent,
  buildJsonView,
  buildMarkdownView,
  type ParsedDocument,
  type ParsedSection,
  type HtmlTableData,
  type MarkdownTableData,
  type ImageData,
  type TextData,
} from '../lib/parse-content'

// ── Types ──

interface DocumentViewerProps {
  documentResult?: DocumentResult
  isLoading?: boolean
  className?: string
}

const FORMAT_TABS = [
  { key: 'sections', label: '구조화 보기' },
  { key: 'raw', label: '원본 텍스트' },
  { key: 'markdown', label: 'Markdown' },
  { key: 'json', label: 'JSON' },
] as const

type FormatTab = (typeof FORMAT_TABS)[number]['key']

// ── Section type config ──

const SECTION_META: Record<
  ParsedSection['type'],
  { icon: typeof Table; color: string; bg: string }
> = {
  'html-table': {
    icon: Table,
    color: 'text-[#0f62fe]',
    bg: 'bg-[#0f62fe]/10',
  },
  'markdown-table': {
    icon: Code,
    color: 'text-[#8a3ffc]',
    bg: 'bg-[#8a3ffc]/10',
  },
  image: {
    icon: Image,
    color: 'text-[#198038]',
    bg: 'bg-[#198038]/10',
  },
  text: {
    icon: FileText,
    color: 'text-[#ff7121]',
    bg: 'bg-[#ff7121]/10',
  },
}

// ── Main Component ──

export function DocumentViewer({
  documentResult,
  isLoading,
  className = '',
}: DocumentViewerProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FormatTab>('sections')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const parsed = useMemo<ParsedDocument | null>(() => {
    if (documentResult?.txt?.preview) {
      return parseDocumentContent(documentResult.txt.preview)
    }
    return null
  }, [documentResult])

  // Derive active section: use selected, or fall back to first
  const activeSection =
    selectedSection && parsed?.sections.some((s) => s.id === selectedSection)
      ? selectedSection
      : (parsed?.sections[0]?.id ?? null)

  if (isLoading) {
    return (
      <div
        className={`bg-card flex items-center justify-center rounded-2xl ${className}`}
      >
        <div className="text-center">
          <Loader2 className="text-primary mx-auto mb-3 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            변환 결과를 불러오는 중...
          </p>
        </div>
      </div>
    )
  }

  if (documentResult?.error) {
    return (
      <div
        className={`bg-card flex items-center justify-center rounded-2xl ${className}`}
      >
        <div className="text-center">
          <AlertCircle className="text-destructive mx-auto mb-3 h-10 w-10" />
          <p className="text-destructive font-semibold">변환 실패</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {documentResult.error.message}
          </p>
        </div>
      </div>
    )
  }

  if (!parsed) {
    return (
      <div
        className={`bg-card flex items-center justify-center rounded-2xl ${className}`}
      >
        <div className="text-center">
          <FileText className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
          <p className="text-muted-foreground text-sm">
            변환이 완료되면 결과가 여기에 표시됩니다.
          </p>
        </div>
      </div>
    )
  }

  const handleSectionClick = (id: string) => {
    setSelectedSection(id)
    setActiveTab('sections')
    sectionRefs.current[id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div
      className={`flex h-full gap-0 overflow-hidden rounded-2xl ${className}`}
    >
      {/* ── Left: Section List ── */}
      <div className="bg-card border-border flex w-[340px] flex-shrink-0 flex-col border-r">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="text-foreground text-sm font-semibold">변환 결과</h3>
            <p className="text-muted-foreground text-xs">
              {parsed.sections.length}개 섹션
              {parsed.metadata.pageCount && ` · ${parsed.metadata.pageCount}p`}
            </p>
          </div>
          {documentResult && (
            <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-[10px]">
              {documentResult.modelCode}
            </span>
          )}
        </div>

        {/* Section cards */}
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {parsed.sections.map((section, idx) => {
            const meta = SECTION_META[section.type]
            const Icon = meta.icon
            const isActive = activeSection === section.id

            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`group w-full rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? 'bg-primary/5 ring-primary/30 ring-1'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg ${meta.bg}`}
                  >
                    <Icon className={`h-3 w-3 ${meta.color}`} />
                  </div>
                  <span className="text-foreground text-xs font-semibold">
                    {section.label}
                  </span>
                  <span className="text-muted-foreground/50 ml-auto font-mono text-[10px]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-2 pl-8 text-[11px] leading-relaxed">
                  {section.preview}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right: Format Viewer ── */}
      <div className="bg-card flex flex-1 flex-col overflow-hidden">
        {/* Tab bar */}
        <div className="border-border flex items-center border-b">
          <div className="flex">
            {FORMAT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-3 text-xs font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-t" />
                )}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <span className="text-muted-foreground/40 pr-4 font-mono text-[10px]">
            {documentResult?.fileName}
          </span>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'sections' && (
            <SectionsView
              sections={parsed.sections}
              activeSection={activeSection}
              sectionRefs={sectionRefs}
            />
          )}
          {activeTab === 'raw' && (
            <pre className="p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {parsed.rawText}
            </pre>
          )}
          {activeTab === 'markdown' && (
            <pre className="p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {buildMarkdownView(parsed)}
            </pre>
          )}
          {activeTab === 'json' && (
            <pre className="p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {buildJsonView(parsed)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sections View (rendered content) ──

function SectionsView({
  sections,
  activeSection,
  sectionRefs,
}: {
  sections: ParsedSection[]
  activeSection: string | null
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}) {
  return (
    <div className="space-y-6 p-5">
      {sections.map((section) => {
        const meta = SECTION_META[section.type]
        const Icon = meta.icon
        const isActive = activeSection === section.id

        return (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el
            }}
            className={`rounded-xl border transition-all ${
              isActive ? 'border-primary/30 shadow-sm' : 'border-border'
            }`}
          >
            {/* Section header */}
            <div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-lg ${meta.bg}`}
              >
                <Icon className={`h-3 w-3 ${meta.color}`} />
              </div>
              <span className="text-foreground text-sm font-semibold">
                {section.label}
              </span>
            </div>

            {/* Section body */}
            <div className="p-4">
              <SectionContent section={section} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Section Content Renderer ──

function SectionContent({ section }: { section: ParsedSection }) {
  switch (section.type) {
    case 'html-table': {
      const d = section.data as HtmlTableData
      return (
        <div
          className="[&_td]:border-border [&_th]:border-border [&_th]:bg-muted overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_th]:border [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(d.html),
          }}
        />
      )
    }
    case 'markdown-table': {
      const d = section.data as MarkdownTableData
      return (
        <div className="space-y-3">
          {d.headerPath.length > 0 && (
            <div>
              <p className="text-foreground mb-1 text-xs font-semibold">
                HeaderPath 구조
              </p>
              <ul className="space-y-0.5">
                {d.headerPath.map((path, i) => (
                  <li key={i} className="text-muted-foreground text-xs">
                    <span className="text-primary mr-1.5">·</span>
                    {path.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-foreground mb-1 text-xs font-semibold">
              데이터 (사실 문장)
            </p>
            <ul className="space-y-0.5">
              {d.rows.map((row, i) => (
                <li key={i} className="text-muted-foreground text-xs">
                  <span className="text-primary mr-1.5">·</span>
                  {row}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
    case 'image': {
      const d = section.data as ImageData
      return (
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
          {d.description}
        </p>
      )
    }
    case 'text': {
      const d = section.data as TextData
      return (
        <pre className="text-foreground overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {d.text}
        </pre>
      )
    }
  }
}
