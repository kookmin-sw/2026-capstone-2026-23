import { useMemo, useState, useRef, useEffect, type ReactNode } from 'react'
import DOMPurify from 'dompurify'
import {
  FileText,
  Table,
  Image,
  Code,
  Loader2,
  Maximize2,
  X,
  Upload,
  FolderOpen,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import type { DocumentResult } from '@/shared/types'

interface ParsedContent {
  metadata: { originalPath?: string; pageCount?: number }
  htmlTables: { html: string }[]
  markdownTables: { title: string; headerPath: string[]; rows: string[] }[]
  imageDescriptions: { id: number; description: string }[]
  plainText: string
}

interface ResultsPanelProps {
  selectedFile: string
  documentResult?: DocumentResult
  isLoading?: boolean
  onFilesAdded?: (files: File[]) => void
}

const COLLAPSE_HEIGHT = 300

function CollapsibleSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isOverflow, setIsOverflow] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const el = contentRef.current
    if (el) {
      setIsOverflow(el.scrollHeight > COLLAPSE_HEIGHT)
    }
  }, [children])

  return (
    <>
      <div className="group/section mb-6">
        <div className="mb-3 flex items-center gap-2">
          {icon}
          <h3 className="text-foreground font-semibold">{title}</h3>
        </div>
        <div className="relative">
          {/* Hover expand button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-background/80 border-border text-muted-foreground hover:text-primary hover:border-primary/50 absolute top-2 right-2 z-10 rounded-lg border p-1.5 opacity-0 backdrop-blur-sm transition-all group-hover/section:opacity-100"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <div
            ref={contentRef}
            className="overflow-hidden"
            style={{ maxHeight: COLLAPSE_HEIGHT }}
          >
            {children}
          </div>
          {isOverflow && (
            <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t" />
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false)
          }}
        >
          <div className="bg-background flex max-h-[95vh] w-full max-w-7xl flex-col rounded-xl shadow-2xl">
            <div className="border-border flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-foreground text-lg font-semibold">
                  {title}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

export function ResultsPanel({
  selectedFile,
  documentResult,
  isLoading,
  onFilesAdded,
}: ResultsPanelProps) {
  const content = useMemo<ParsedContent | null>(() => {
    if (documentResult?.txt?.preview) {
      return parseConvertedContent(documentResult.txt.preview)
    }
    return null
  }, [documentResult])

  if (!selectedFile) {
    return <EmptyState onFilesAdded={onFilesAdded} />
  }

  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardContent className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <Loader2 className="text-primary mx-auto mb-3 h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">변환 결과를 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (documentResult?.error) {
    return (
      <Card className="flex-1">
        <CardContent className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <FileText className="text-destructive mx-auto mb-3 h-12 w-12" />
            <p className="text-destructive font-medium">변환 실패</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {documentResult.error.message}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!content) {
    return (
      <Card className="flex-1">
        <CardContent className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <FileText className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
            <p className="text-muted-foreground">
              변환이 완료되면 결과가 여기에 표시됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex-1 overflow-y-auto">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">
            변환 결과 미리보기
          </h2>
          {documentResult && (
            <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs">
              {documentResult.modelCode}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-muted/50 mb-6 rounded-lg p-4 font-mono text-xs">
          <p>문서 ID: {documentResult?.documentId}</p>
          <p>파일명: {documentResult?.fileName}</p>
          {content.metadata.originalPath && (
            <p>원본 파일 경로: {content.metadata.originalPath}</p>
          )}
          {content.metadata.pageCount && (
            <p>페이지 수: {content.metadata.pageCount}</p>
          )}
        </div>

        {/* HTML Tables */}
        {content.htmlTables.length > 0 && (
          <CollapsibleSection
            title="HTML 미리보기"
            icon={<Table className="text-primary h-5 w-5" />}
          >
            {content.htmlTables.map((table, idx) => (
              <div
                key={idx}
                className="bg-card border-border [&_td]:border-border [&_th]:border-border [&_th]:bg-muted mb-4 overflow-x-auto rounded-lg border [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_th]:border [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(table.html),
                }}
              />
            ))}
          </CollapsibleSection>
        )}

        {/* Markdown Tables */}
        {content.markdownTables.length > 0 && (
          <CollapsibleSection
            title="Markdown 선형화"
            icon={<Code className="text-primary h-5 w-5" />}
          >
            {content.markdownTables.map((table, idx) => (
              <div
                key={idx}
                className="bg-muted/50 border-primary mb-4 rounded-r-lg border-l-4 p-4"
              >
                <h4 className="text-primary mb-2 font-semibold">
                  # {table.title}
                </h4>
                <div className="mb-2">
                  <p className="text-foreground text-sm font-medium">
                    ## HeaderPath 구조
                  </p>
                  <ul className="mt-1 ml-4 space-y-1">
                    {table.headerPath.map((path, i) => (
                      <li key={i} className="text-muted-foreground text-sm">
                        - {path.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    ## 데이터 (사실 문장)
                  </p>
                  <ul className="mt-1 ml-4 space-y-1">
                    {table.rows.map((row, i) => (
                      <li key={i} className="text-muted-foreground text-sm">
                        - {row}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CollapsibleSection>
        )}

        {/* Image Descriptions */}
        {content.imageDescriptions.length > 0 && (
          <CollapsibleSection
            title="이미지 설명"
            icon={<Image className="text-primary h-5 w-5" />}
          >
            {content.imageDescriptions.map((img) => (
              <div
                key={img.id}
                className="bg-muted/50 border-primary mb-4 rounded-r-lg border-l-4 p-4"
              >
                <p className="text-foreground text-sm whitespace-pre-line">
                  {img.description}
                </p>
              </div>
            ))}
          </CollapsibleSection>
        )}

        {/* Plain Text */}
        <CollapsibleSection
          title="원본 텍스트"
          icon={<FileText className="text-primary h-5 w-5" />}
        >
          <pre className="bg-muted/50 overflow-x-auto rounded-lg p-4 font-mono text-xs whitespace-pre-wrap">
            {content.plainText}
          </pre>
        </CollapsibleSection>
      </CardContent>
    </Card>
  )
}

const ACCEPTED_EXTENSIONS = '.hwp,.hwpx,.pdf,.png,.jpg,.jpeg,.bmp,.tiff'

const WORKFLOW_STEPS = [
  {
    icon: Upload,
    title: '문서 업로드',
    description: 'HWP, PDF, 이미지 등\n문서를 올려주세요',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Sparkles,
    title: 'AI 변환',
    description: 'VLM이 표, 이미지, 텍스트를\n구조화된 형태로 추출합니다',
    color: 'text-[#8a3ffc] bg-[#8a3ffc]/10',
  },
  {
    icon: MessageCircle,
    title: '결과 확인',
    description: '변환 결과를 미리보고\nAI 챗봇에게 질문해보세요',
    color: 'text-[#198038] bg-[#198038]/10',
  },
] as const

function EmptyState({
  onFilesAdded,
}: {
  onFilesAdded?: (files: File[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 p-8">
      {/* Workflow steps */}
      <div className="flex items-start gap-4">
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={step.title} className="flex items-start gap-4">
            <div className="flex w-[160px] flex-col items-center text-center">
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}
              >
                <step.icon className="h-6 w-6" />
              </div>
              <p className="text-foreground mb-1 text-sm font-semibold">
                {step.title}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
                {step.description}
              </p>
            </div>
            {i < WORKFLOW_STEPS.length - 1 && (
              <ArrowRight className="text-border mt-4 h-5 w-5 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Upload buttons */}
      {onFilesAdded && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-border hover:border-primary/40 hover:text-primary text-foreground flex items-center gap-2 rounded-lg border bg-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <Upload className="h-4 w-4" />
              파일 선택
            </button>
            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="border-border hover:border-primary/40 hover:text-primary text-foreground flex items-center gap-2 rounded-lg border bg-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              폴더 선택
            </button>
          </div>
          <p className="text-muted-foreground/60 text-xs">
            또는 이 화면에 파일을 드래그하여 업로드
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_EXTENSIONS}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) onFilesAdded(Array.from(e.target.files))
              e.target.value = ''
            }}
          />
          <input
            ref={folderInputRef}
            type="file"
            // @ts-expect-error webkitdirectory is valid but not in TS types
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) onFilesAdded(Array.from(e.target.files))
              e.target.value = ''
            }}
          />
        </div>
      )}
    </div>
  )
}

function parseConvertedContent(text: string): ParsedContent {
  const lines = text.split('\n')
  const metadata: ParsedContent['metadata'] = {}
  const htmlTables: ParsedContent['htmlTables'] = []
  const markdownTables: ParsedContent['markdownTables'] = []
  const imageDescriptions: ParsedContent['imageDescriptions'] = []

  lines.slice(0, 3).forEach((line) => {
    if (line.includes('원본 파일 경로:'))
      metadata.originalPath = line.split(':').slice(1).join(':').trim()
    else if (line.includes('페이지 수:'))
      metadata.pageCount = parseInt(line.split(':')[1].trim())
  })

  let match: RegExpExecArray | null
  const htmlTableRegex = /\[\[TABLE\]\]([\s\S]*?)\[\[\/TABLE\]\]/g
  while ((match = htmlTableRegex.exec(text)) !== null) {
    htmlTables.push({ html: match[1].trim() })
  }

  const markdownTableRegex =
    /\[\[TABLE_MARKDOWN\]\]([\s\S]*?)\[\[\/TABLE_MARKDOWN\]\]/g
  while ((match = markdownTableRegex.exec(text)) !== null) {
    const tableContent = match[1].trim()
    const titleMatch = tableContent.match(/# TableTitle: (.+)/)
    const title = titleMatch ? titleMatch[1] : ''
    const headerPathSection = tableContent.match(
      /## HeaderPath 구조([\s\S]*?)## 데이터/,
    )
    const headerPath: string[] = []
    if (headerPathSection) {
      headerPathSection[1]
        .trim()
        .split('\n')
        .forEach((line) => {
          const trimmed = line.trim()
          if (trimmed.startsWith('-'))
            headerPath.push(trimmed.substring(1).trim())
        })
    }
    const rowsSection = tableContent.match(/## 데이터 \(사실 문장\)([\s\S]*)/)
    const rows: string[] = []
    if (rowsSection) {
      rowsSection[1]
        .trim()
        .split('\n')
        .forEach((line) => {
          const trimmed = line.trim()
          if (trimmed.startsWith('-')) rows.push(trimmed.substring(1).trim())
        })
    }
    markdownTables.push({ title, headerPath, rows })
  }

  const imageRegex = /\[\[IMAGE\]\]([\s\S]*?)\[\[\/IMAGE\]\]/g
  let imageId = 1
  while ((match = imageRegex.exec(text)) !== null) {
    imageDescriptions.push({ id: imageId++, description: match[1].trim() })
  }

  const plainText = text
    .replace(/\[\[TABLE\]\][\s\S]*?\[\[\/TABLE\]\]/g, '[표 생략]')
    .replace(
      /\[\[TABLE_MARKDOWN\]\][\s\S]*?\[\[\/TABLE_MARKDOWN\]\]/g,
      '[Markdown 표 생략]',
    )
    .replace(/\[\[IMAGE\]\][\s\S]*?\[\[\/IMAGE\]\]/g, '[이미지 설명 생략]')

  return { metadata, htmlTables, markdownTables, imageDescriptions, plainText }
}
