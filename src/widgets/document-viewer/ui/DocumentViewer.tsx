import { useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import { FileText, Loader2, AlertCircle, Eye, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { DocumentResult } from '@/shared/types'
import {
  parseDocumentContent,
  buildJsonView,
  type ParsedDocument,
  type ContentBlock,
} from '../lib/parse-content'

// ── Types ──

interface DocumentViewerProps {
  /** The conversion result to display on the right panel */
  documentResult?: DocumentResult
  isLoading?: boolean
  /** Original file for the left preview panel. File object or blob URL string. */
  originalFile?: File | null
  className?: string
}

const FORMAT_TABS = [
  { key: 'preview', label: 'Preview' },
  { key: 'html', label: 'HTML' },
  { key: 'json', label: 'JSON' },
] as const

type FormatTab = (typeof FORMAT_TABS)[number]['key']

function hideMetadataDivider(text: string): string {
  const pageHeaderIndex = text.search(/^##\s*Page\b/m)
  if (pageHeaderIndex === -1) return text

  const metadataSection = text.slice(0, pageHeaderIndex)
  const contentSection = text.slice(pageHeaderIndex)
  const metadataLines = metadataSection.split('\n')

  const cleanedMetadataLines = metadataLines.filter((line, index) => {
    const trimmed = line.trim()
    const previousLine = metadataLines[index - 1]?.trim()

    if (!/^[-]{3,}$/.test(trimmed)) return true

    return !(
      previousLine?.startsWith('원본 파일') ||
      previousLine?.startsWith('원본 파일 경로') ||
      previousLine?.startsWith('페이지 수:')
    )
  })

  return `${cleanedMetadataLines.join('\n')}${contentSection}`
}

// ── Block type styling ──

const BLOCK_STYLES: Record<
  ContentBlock['type'],
  { color: string; bg: string; hoverBorder: string; hoverBg: string }
> = {
  header: {
    color: 'text-[#0f62fe]',
    bg: 'bg-[#0f62fe]/8',
    hoverBorder: 'border-[#0f62fe]/40',
    hoverBg: 'bg-[#0f62fe]/5',
  },
  paragraph: {
    color: 'text-[#198038]',
    bg: 'bg-[#198038]/8',
    hoverBorder: 'border-[#198038]/40',
    hoverBg: 'bg-[#198038]/5',
  },
  table: {
    color: 'text-[#8a3ffc]',
    bg: 'bg-[#8a3ffc]/8',
    hoverBorder: 'border-[#8a3ffc]/40',
    hoverBg: 'bg-[#8a3ffc]/5',
  },
  'markdown-table': {
    color: 'text-[#8a3ffc]',
    bg: 'bg-[#8a3ffc]/8',
    hoverBorder: 'border-[#8a3ffc]/40',
    hoverBg: 'bg-[#8a3ffc]/5',
  },
  image: {
    color: 'text-[#ff7121]',
    bg: 'bg-[#ff7121]/8',
    hoverBorder: 'border-[#ff7121]/40',
    hoverBg: 'bg-[#ff7121]/5',
  },
}

// ── Main Component ──

export function DocumentViewer({
  documentResult,
  isLoading,
  originalFile,
  className = '',
}: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<FormatTab>('preview')
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const [isParsedPanelHovered, setIsParsedPanelHovered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const parsed = useMemo<ParsedDocument | null>(() => {
    if (documentResult?.txt?.preview) {
      return parseDocumentContent(
        hideMetadataDivider(documentResult.txt.preview),
      )
    }
    return null
  }, [documentResult])

  const copyText = useMemo(() => {
    if (!parsed) return null
    if (activeTab === 'html') return parsed.rawText
    if (activeTab === 'json') return buildJsonView(parsed)
    return null
  }, [activeTab, parsed])

  const originalFileUrl = useMemo(() => {
    if (!originalFile) return null
    return URL.createObjectURL(originalFile)
  }, [originalFile])

  const handleCopy = async () => {
    if (!copyText) return

    try {
      await navigator.clipboard.writeText(copyText)
      setIsCopied(true)
      toast.success(
        activeTab === 'json' ? 'JSON을 복사했습니다.' : 'HTML을 복사했습니다.',
      )
      window.setTimeout(() => setIsCopied(false), 1500)
    } catch {
      toast.error('복사에 실패했습니다.')
    }
  }

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

  return (
    <div
      className={`border-border flex h-full min-h-0 overflow-hidden rounded-2xl border bg-[#eef1f5] shadow-sm ${className}`}
    >
      {/* ── Left: Original Document Viewer (화면 높이에 고정) ── */}
      <div className="flex h-full min-h-0 w-1/2 flex-shrink-0 flex-col overflow-hidden bg-white">
        <div className="border-border flex items-center justify-between border-b bg-[#f7f8fa] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Eye className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-foreground text-xs font-semibold">
              원본 문서
            </span>
          </div>
          <span className="text-muted-foreground truncate pl-4 font-mono text-[10px]">
            {documentResult?.fileName}
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-white">
          <OriginalFilePreview
            file={originalFile}
            fileUrl={originalFileUrl}
            fileName={documentResult?.fileName}
          />
        </div>
      </div>

      {/* ── Right: Parsed Document (스크롤 가능) ── */}
      <div
        className="border-border relative flex h-full min-h-0 w-1/2 flex-col overflow-hidden border-l bg-[#fcfcfd]"
        onMouseEnter={() => setIsParsedPanelHovered(true)}
        onMouseLeave={() => {
          setIsParsedPanelHovered(false)
          setIsCopied(false)
        }}
      >
        {/* Tab bar */}
        <div className="border-border flex items-center justify-between border-b bg-[#f4f6f8]">
          <div className="flex items-center gap-1 px-2">
            <span className="text-foreground px-2 text-xs font-semibold">
              Document parsing
            </span>
          </div>
          <div className="flex">
            {FORMAT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${
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
        </div>

        {copyText && (
          <button
            type="button"
            onClick={handleCopy}
            className={`border-border bg-background/95 text-muted-foreground hover:text-foreground absolute top-14 right-3 z-10 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur transition-all ${
              isParsedPanelHovered
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {isCopied ? 'Copied' : 'Copy'}
          </button>
        )}

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeTab === 'preview' && (
            <BlocksPreview
              blocks={parsed.blocks}
              hoveredBlock={hoveredBlock}
              onHoverBlock={setHoveredBlock}
            />
          )}
          {activeTab === 'html' && (
            <pre className="text-foreground/80 p-5 pt-12 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {parsed.rawText}
            </pre>
          )}
          {activeTab === 'json' && (
            <pre className="text-foreground/80 p-5 pt-12 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {buildJsonView(parsed)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Original File Preview ──

function OriginalFilePreview({
  file,
  fileUrl,
  fileName,
}: {
  file?: File | null
  fileUrl: string | null
  fileName?: string
}) {
  const ext = (fileName ?? file?.name ?? '').split('.').pop()?.toLowerCase()

  // PDF
  if (ext === 'pdf' && fileUrl) {
    return (
      <iframe
        src={fileUrl}
        className="h-full w-full border-0"
        title="원본 PDF"
      />
    )
  }

  // Image formats
  if (
    fileUrl &&
    ext &&
    ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'gif', 'webp'].includes(ext)
  ) {
    return (
      <div className="flex h-full items-center justify-center overflow-auto p-4">
        <img
          src={fileUrl}
          alt="원본 이미지"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    )
  }

  // Fallback: unsupported or no file
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f4f6]">
        <FileText className="text-muted-foreground h-8 w-8" />
      </div>
      <div className="text-center">
        <p className="text-muted-foreground text-sm font-medium">
          {fileName ?? '원본 파일'}
        </p>
        <p className="text-muted-foreground/60 mt-1 text-xs">
          {fileUrl
            ? '이 파일 형식은 미리보기를 지원하지 않습니다'
            : '원본 파일이 없습니다'}
        </p>
      </div>
    </div>
  )
}

// ── Blocks Preview (main parsed view) ──

function BlocksPreview({
  blocks,
  hoveredBlock,
  onHoverBlock,
}: {
  blocks: ContentBlock[]
  hoveredBlock: string | null
  onHoverBlock: (id: string | null) => void
}) {
  return (
    <div className="min-h-full space-y-0 p-4">
      {blocks.map((block) => {
        const style = BLOCK_STYLES[block.type]
        const isHovered = hoveredBlock === block.id

        return (
          <div
            key={block.id}
            className={`relative border-l-2 py-2 pr-3 pl-4 transition-all duration-150 ${
              isHovered
                ? `${style.hoverBorder} ${style.hoverBg}`
                : 'border-transparent'
            }`}
            onMouseEnter={() => onHoverBlock(block.id)}
            onMouseLeave={() => onHoverBlock(null)}
          >
            {/* Type label — shows on hover */}
            <span
              className={`absolute top-2 right-3 rounded px-1.5 py-0.5 text-[10px] font-semibold transition-opacity ${style.color} ${style.bg} ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {block.index + 1} - {block.label}
            </span>

            <BlockContent block={block} />
          </div>
        )
      })}
    </div>
  )
}

// ── Block Content Renderer ──

function BlockContent({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'header':
      return (
        <p className="text-foreground text-base leading-relaxed font-semibold">
          {block.content}
        </p>
      )

    case 'paragraph':
      return (
        <p className="text-foreground/85 text-sm leading-[1.7]">
          {block.content}
        </p>
      )

    case 'table':
      return (
        <div
          className="[&_td]:border-border [&_th]:border-border overflow-x-auto text-sm [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:px-2.5 [&_td]:py-1.5 [&_td]:text-xs [&_th]:border [&_th]:bg-[#f5f7fa] [&_th]:px-2.5 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(block.htmlContent ?? block.content),
          }}
        />
      )

    case 'markdown-table':
      return (
        <pre className="text-foreground/80 overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {block.content}
        </pre>
      )

    case 'image':
      return (
        <div className="text-foreground/80 text-sm leading-relaxed italic">
          {block.content}
        </div>
      )
  }
}
