import { useEffect, useMemo, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import {
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Scan,
} from 'lucide-react'
import { Document as PdfDocument, Page as PdfPage, pdfjs } from 'react-pdf'
import { toast } from 'sonner'
import type {
  MouseEvent as ReactMouseEvent,
  WheelEvent as ReactWheelEvent,
} from 'react'
import type { DocumentResult } from '@/shared/types'
import {
  parseDocumentContent,
  buildDocumentContentText,
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
  originalFile?: File | string | null
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

const FORMAT_TABS = [
  { key: 'preview', label: 'Preview' },
  { key: 'html', label: 'HTML' },
  { key: 'json', label: 'JSON' },
] as const

type FormatTab = (typeof FORMAT_TABS)[number]['key']
const ORIGINAL_PREVIEW_MIN_ZOOM = 0.5
const ORIGINAL_PREVIEW_MAX_ZOOM = 3
const ORIGINAL_PREVIEW_ZOOM_STEP = 0.25
const ORIGINAL_PREVIEW_WHEEL_ZOOM_STEP = 0.05

pdfjs.GlobalWorkerOptions.workerSrc =
  new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString() +
  '?worker_v=20260504_mjs_mime'

function useDragScroll<T extends HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const dragStateRef = useRef<{
    isDragging: boolean
    startX: number
    startY: number
    scrollLeft: number
    scrollTop: number
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  })
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (event: ReactMouseEvent<T>) => {
    const element = ref.current
    if (!element) return

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    }
    setIsDragging(true)
  }

  const handleMouseMove = (event: ReactMouseEvent<T>) => {
    const element = ref.current
    const dragState = dragStateRef.current
    if (!element || !dragState.isDragging) return

    event.preventDefault()
    element.scrollLeft =
      dragState.scrollLeft - (event.clientX - dragState.startX)
    element.scrollTop = dragState.scrollTop - (event.clientY - dragState.startY)
  }

  const stopDragging = () => {
    if (!dragStateRef.current.isDragging) return
    dragStateRef.current.isDragging = false
    setIsDragging(false)
  }

  return {
    ref,
    isDragging,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: stopDragging,
      onMouseLeave: stopDragging,
    },
  }
}

function clampZoom(value: number) {
  return Math.min(
    ORIGINAL_PREVIEW_MAX_ZOOM,
    Math.max(ORIGINAL_PREVIEW_MIN_ZOOM, value),
  )
}

function getWheelZoomDelta(deltaY: number) {
  if (deltaY === 0) return 0
  return deltaY < 0
    ? ORIGINAL_PREVIEW_WHEEL_ZOOM_STEP
    : -ORIGINAL_PREVIEW_WHEEL_ZOOM_STEP
}

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
  list: {
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
  emptyTitle = '변환 결과가 없습니다',
  emptyDescription = '변환이 완료되면 결과가 여기에 표시됩니다.',
  className = '',
}: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<FormatTab>('preview')
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const [isParsedPanelHovered, setIsParsedPanelHovered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const parsed = useMemo<ParsedDocument | null>(() => {
    const contentText = buildDocumentContentText(documentResult)
    if (!contentText) return null
    return parseDocumentContent(hideMetadataDivider(contentText))
  }, [documentResult])

  const copyText = useMemo(() => {
    if (!parsed) return null
    if (activeTab === 'html') return parsed.rawText
    if (activeTab === 'json') return buildJsonView(parsed)
    return null
  }, [activeTab, parsed])

  const originalFileUrl = useMemo<string | null>(() => {
    if (!originalFile) return null
    if (typeof originalFile === 'string') return originalFile
    return URL.createObjectURL(originalFile)
  }, [originalFile])

  useEffect(() => {
    if (!originalFileUrl || typeof originalFile === 'string') return
    return () => URL.revokeObjectURL(originalFileUrl)
  }, [originalFile, originalFileUrl])

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

  return (
    <div
      className={`border-border flex h-full min-h-0 min-w-0 overflow-hidden rounded-2xl border bg-[#eef1f5] shadow-sm ${className}`}
    >
      {/* ── Left: Original Document Viewer (화면 높이에 고정) ── */}
      <div className="flex h-full min-h-0 w-1/2 min-w-0 flex-shrink-0 flex-col overflow-hidden bg-white">
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
        <div className="min-h-0 flex-1 overflow-hidden bg-white">
          <OriginalFilePreview
            file={originalFile}
            fileUrl={originalFileUrl}
            fileName={documentResult?.fileName}
          />
        </div>
      </div>

      {/* ── Right: Parsed Document (스크롤 가능) ── */}
      <div
        className="border-border relative flex h-full min-h-0 w-1/2 min-w-0 flex-col overflow-hidden border-l bg-[#fcfcfd]"
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
          {!parsed && (
            <PanelEmptyState
              icon={FileText}
              title={emptyTitle}
              description={emptyDescription}
            />
          )}
          {parsed && activeTab === 'preview' && (
            <BlocksPreview
              blocks={parsed.blocks}
              hoveredBlock={hoveredBlock}
              onHoverBlock={setHoveredBlock}
            />
          )}
          {parsed && activeTab === 'html' && (
            <pre className="text-foreground/80 p-5 pt-12 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {parsed.rawText}
            </pre>
          )}
          {parsed && activeTab === 'json' && (
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
  file?: File | string | null
  fileUrl: string | null
  fileName?: string
}) {
  const localFileName = typeof file === 'string' ? undefined : file?.name
  const ext = (fileName ?? localFileName ?? '').split('.').pop()?.toLowerCase()
  const mimeType =
    typeof file === 'string' ? '' : (file?.type?.toLowerCase() ?? '')
  const isImageByMime = mimeType.startsWith('image/')
  const isPdfByMime = mimeType === 'application/pdf'
  const isImageByExt =
    !!ext &&
    ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'gif', 'webp'].includes(ext)
  const isPdfByExt = ext === 'pdf'

  const isImage = !!fileUrl && (isImageByMime || (!mimeType && isImageByExt))
  const isPdf =
    !!fileUrl && !isImage && (isPdfByMime || (!mimeType && isPdfByExt))

  if (isPdf) return <PdfOriginalPreview key={fileUrl} fileUrl={fileUrl} />
  if (isImage) return <ImageOriginalPreview key={fileUrl} fileUrl={fileUrl} />

  if (isPdfByExt || isPdfByMime) {
    return (
      <PanelEmptyState
        icon={AlertCircle}
        title="PDF를 불러오지 못했습니다"
        description="원본 문서 파일을 찾을 수 없거나 미리보기 URL이 없습니다."
      />
    )
  }

  // Fallback: unsupported or no file
  return (
    <PanelEmptyState
      icon={FileText}
      title={fileName ?? '원본 파일'}
      description={
        fileUrl
          ? '이 파일 형식은 미리보기를 지원하지 않습니다'
          : '원본 파일이 없습니다'
      }
    />
  )
}

function PanelEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileText
  title: string
  description: string
}) {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center p-6">
      <div className="max-w-xs text-center">
        <div className="bg-muted mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
          <Icon className="text-muted-foreground h-7 w-7" />
        </div>
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

function OriginalPreviewToolbar({
  zoom,
  onFitWidth,
  onFitPage,
  onZoomOut,
  onZoomIn,
  disableZoomOut,
  disableZoomIn,
}: {
  zoom: number
  onFitWidth: () => void
  onFitPage: () => void
  onZoomOut: () => void
  onZoomIn: () => void
  disableZoomOut: boolean
  disableZoomIn: boolean
}) {
  return (
    <div className="border-border flex items-center justify-between border-b bg-[#fbfbfc] px-3 py-2">
      <span className="text-muted-foreground text-[11px] font-medium">
        기본 보기: 너비 맞춤
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onFitWidth}
          disabled={zoom === 1}
          className="border-border text-muted-foreground hover:text-foreground disabled:text-muted-foreground/40 inline-flex h-8 items-center gap-1 rounded-md border bg-white px-2.5 text-[11px] font-medium disabled:cursor-not-allowed"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Fit width
        </button>
        <button
          type="button"
          onClick={onFitPage}
          className="border-border text-muted-foreground hover:text-foreground inline-flex h-8 items-center gap-1 rounded-md border bg-white px-2.5 text-[11px] font-medium"
        >
          <Scan className="h-3.5 w-3.5" />
          Fit page
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          disabled={disableZoomOut}
          className="border-border text-muted-foreground hover:text-foreground disabled:text-muted-foreground/40 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white disabled:cursor-not-allowed"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <div className="text-foreground min-w-12 text-center text-[11px] font-semibold tabular-nums">
          {Math.round(zoom * 100)}%
        </div>
        <button
          type="button"
          onClick={onZoomIn}
          disabled={disableZoomIn}
          className="border-border text-muted-foreground hover:text-foreground disabled:text-muted-foreground/40 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white disabled:cursor-not-allowed"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function ImageOriginalPreview({ fileUrl }: { fileUrl: string }) {
  const [zoom, setZoom] = useState(1)
  const [fitMode, setFitMode] = useState<'width' | 'page' | 'custom'>('width')
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const {
    ref: scrollRef,
    isDragging,
    dragHandlers,
  } = useDragScroll<HTMLDivElement>()

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateSize = () => {
      setContainerSize({
        width: element.clientWidth,
        height: element.clientHeight,
      })
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const fitPageZoom = useMemo(() => {
    if (
      containerSize.width <= 0 ||
      containerSize.height <= 0 ||
      imageSize.width <= 0 ||
      imageSize.height <= 0
    ) {
      return 1
    }

    const fitWidthHeight =
      containerSize.width * (imageSize.height / imageSize.width)
    const scale = Math.min(1, containerSize.height / fitWidthHeight)
    return Math.max(ORIGINAL_PREVIEW_MIN_ZOOM, scale)
  }, [containerSize, imageSize])

  const effectiveZoom =
    fitMode === 'width' ? 1 : fitMode === 'page' ? fitPageZoom : zoom

  const handleWheelZoom = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return

    event.preventDefault()
    const nextZoom = clampZoom(effectiveZoom + getWheelZoomDelta(event.deltaY))
    setFitMode('custom')
    setZoom(nextZoom)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f7f9]">
      <OriginalPreviewToolbar
        zoom={effectiveZoom}
        onFitWidth={() => setFitMode('width')}
        onFitPage={() => setFitMode('page')}
        onZoomOut={() => {
          setFitMode('custom')
          setZoom(
            Math.max(
              ORIGINAL_PREVIEW_MIN_ZOOM,
              effectiveZoom - ORIGINAL_PREVIEW_ZOOM_STEP,
            ),
          )
        }}
        onZoomIn={() => {
          setFitMode('custom')
          setZoom(
            Math.min(
              ORIGINAL_PREVIEW_MAX_ZOOM,
              effectiveZoom + ORIGINAL_PREVIEW_ZOOM_STEP,
            ),
          )
        }}
        disableZoomOut={effectiveZoom <= ORIGINAL_PREVIEW_MIN_ZOOM}
        disableZoomIn={effectiveZoom >= ORIGINAL_PREVIEW_MAX_ZOOM}
      />
      <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className={`h-full min-w-0 overflow-auto bg-[#f6f7f9] ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onWheel={handleWheelZoom}
          {...dragHandlers}
        >
          <div
            className="min-h-full"
            style={{
              width:
                containerSize.width > 0
                  ? `${Math.max(containerSize.width, containerSize.width * effectiveZoom)}px`
                  : '100%',
            }}
          >
            <div
              className="mx-auto border border-[#dde1e6] bg-white shadow-sm"
              style={{
                width:
                  containerSize.width > 0
                    ? `${containerSize.width * effectiveZoom}px`
                    : `${effectiveZoom * 100}%`,
              }}
            >
              <img
                src={fileUrl}
                alt="원본 이미지"
                className="block h-auto w-full max-w-none select-none"
                draggable={false}
                onLoad={(event) => {
                  setImageSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PdfOriginalPreview({ fileUrl }: { fileUrl: string }) {
  const [zoom, setZoom] = useState(1)
  const [fitMode, setFitMode] = useState<'width' | 'page' | 'custom'>('width')
  const [numPages, setNumPages] = useState(0)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [firstPageSize, setFirstPageSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const {
    ref: scrollRef,
    isDragging,
    dragHandlers,
  } = useDragScroll<HTMLDivElement>()

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateSize = () => {
      setContainerSize({
        width: element.clientWidth,
        height: element.clientHeight,
      })
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const fitPageZoom = useMemo(() => {
    if (
      containerSize.width <= 0 ||
      containerSize.height <= 0 ||
      firstPageSize.width <= 0 ||
      firstPageSize.height <= 0
    ) {
      return 1
    }

    const fitWidthHeight =
      containerSize.width * (firstPageSize.height / firstPageSize.width)
    const scale = Math.min(1, containerSize.height / fitWidthHeight)
    return Math.max(ORIGINAL_PREVIEW_MIN_ZOOM, scale)
  }, [containerSize, firstPageSize])

  const effectiveZoom =
    fitMode === 'width' ? 1 : fitMode === 'page' ? fitPageZoom : zoom
  const pageWidth = Math.max(1, Math.floor(containerSize.width * effectiveZoom))

  const handleWheelZoom = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return

    event.preventDefault()
    const nextZoom = clampZoom(effectiveZoom + getWheelZoomDelta(event.deltaY))
    setFitMode('custom')
    setZoom(nextZoom)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f7f9]">
      <OriginalPreviewToolbar
        zoom={effectiveZoom}
        onFitWidth={() => setFitMode('width')}
        onFitPage={() => setFitMode('page')}
        onZoomOut={() => {
          setFitMode('custom')
          setZoom(
            Math.max(
              ORIGINAL_PREVIEW_MIN_ZOOM,
              effectiveZoom - ORIGINAL_PREVIEW_ZOOM_STEP,
            ),
          )
        }}
        onZoomIn={() => {
          setFitMode('custom')
          setZoom(
            Math.min(
              ORIGINAL_PREVIEW_MAX_ZOOM,
              effectiveZoom + ORIGINAL_PREVIEW_ZOOM_STEP,
            ),
          )
        }}
        disableZoomOut={effectiveZoom <= ORIGINAL_PREVIEW_MIN_ZOOM}
        disableZoomIn={effectiveZoom >= ORIGINAL_PREVIEW_MAX_ZOOM}
      />
      <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden">
        {containerSize.width > 0 ? (
          <div
            ref={scrollRef}
            className={`h-full min-w-0 overflow-auto bg-[#f6f7f9] ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onWheel={handleWheelZoom}
            {...dragHandlers}
          >
            <div
              className="min-h-full py-4"
              style={{
                width: `${Math.max(containerSize.width, pageWidth)}px`,
              }}
            >
              <PdfDocument
                file={fileUrl}
                loading={
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    PDF 불러오는 중...
                  </div>
                }
                error={
                  <PanelEmptyState
                    icon={AlertCircle}
                    title="PDF를 불러오지 못했습니다"
                    description="원본 문서 미리보기를 열 수 없습니다."
                  />
                }
                onLoadSuccess={({ numPages: loadedPages }) =>
                  setNumPages(loadedPages)
                }
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <div
                    key={`${fileUrl}-${index + 1}`}
                    className="mx-auto mb-4 border border-[#dde1e6] bg-white shadow-sm last:mb-0"
                    style={{ width: `${pageWidth}px` }}
                  >
                    <PdfPage
                      pageNumber={index + 1}
                      width={pageWidth}
                      onLoadSuccess={(page) => {
                        if (index === 0) {
                          setFirstPageSize({
                            width: page.originalWidth,
                            height: page.originalHeight,
                          })
                        }
                      }}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      loading={
                        <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                          페이지 렌더링 중...
                        </div>
                      }
                    />
                  </div>
                ))}
              </PdfDocument>
            </div>
          </div>
        ) : null}
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

    case 'list':
      return (
        <ul className="text-foreground/85 list-disc space-y-1.5 pl-5 text-sm leading-[1.7]">
          {block.content.split('\n').map((item, index) => (
            <li key={`${block.id}-${index}`}>{item}</li>
          ))}
        </ul>
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
