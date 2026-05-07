/** Sequential content block — represents one piece of the parsed document */
export interface ContentBlock {
  id: string
  index: number
  type: 'header' | 'paragraph' | 'list' | 'table' | 'markdown-table' | 'image'
  label: string
  content: string
  htmlContent?: string
}

export interface ParsedDocument {
  metadata: { originalPath?: string; pageCount?: number }
  blocks: ContentBlock[]
  rawText: string
}

interface DocumentContentSource {
  txt?: {
    preview?: string | null
  } | null
  markdown?: unknown
}

const TABLE_MARKDOWN_START = '[[TABLE_MARKDOWN]]'
const TABLE_MARKDOWN_END = '[[/TABLE_MARKDOWN]]'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeMarkdownValue(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) {
    return value.map(normalizeMarkdownValue).filter(Boolean).join('\n\n')
  }
  if (!isRecord(value)) return ''

  const preferredKeys = [
    'markdown',
    'markdownSection',
    'contentMarkdown',
    'content_markdown',
    'text',
    'content',
  ]

  const directValues = preferredKeys
    .map((key) => normalizeMarkdownValue(value[key]))
    .filter(Boolean)

  if (directValues.length > 0) return directValues.join('\n\n')

  return Object.values(value)
    .map(normalizeMarkdownValue)
    .filter(Boolean)
    .join('\n\n')
}

function toMarkdownBlock(markdown: string): string {
  if (markdown.includes(TABLE_MARKDOWN_START)) return markdown
  return `${TABLE_MARKDOWN_START}\n${markdown}\n${TABLE_MARKDOWN_END}`
}

export function buildDocumentContentText(
  documentResult: DocumentContentSource | undefined,
): string {
  const preview = documentResult?.txt?.preview?.trim() ?? ''
  const markdown = normalizeMarkdownValue(documentResult?.markdown)
  if (!markdown) return preview

  if (preview.includes(markdown)) return preview

  return [preview, toMarkdownBlock(markdown)].filter(Boolean).join('\n\n')
}

/**
 * Parse converted document text into sequential blocks.
 * Preserves the linear order of content as it appears in the document.
 */
export function parseDocumentContent(text: string): ParsedDocument {
  const metadata: ParsedDocument['metadata'] = {}
  const blocks: ContentBlock[] = []
  let blockIdx = 0

  // Extract metadata from first few lines
  const lines = text.split('\n')
  const metaLines: number[] = []
  lines.slice(0, 5).forEach((line, i) => {
    if (line.includes('원본 파일 경로:')) {
      metadata.originalPath = line.split(':').slice(1).join(':').trim()
      metaLines.push(i)
    } else if (line.includes('페이지 수:')) {
      metadata.pageCount = parseInt(line.split(':')[1].trim())
      metaLines.push(i)
    }
  })

  // Build a marker map: find all marker positions in the text
  interface Marker {
    start: number
    end: number
    type: 'table' | 'markdown-table' | 'image'
    content: string
    visibleInPreview: boolean
  }

  const markers: Marker[] = []

  const htmlTableRegex = /\[\[TABLE\]\]([\s\S]*?)\[\[\/TABLE\]\]/g
  let match: RegExpExecArray | null
  while ((match = htmlTableRegex.exec(text)) !== null) {
    markers.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'table',
      content: match[1].trim(),
      visibleInPreview: true,
    })
  }

  const mdTableRegex =
    /\[\[TABLE_MARKDOWN\]\]([\s\S]*?)\[\[\/TABLE_MARKDOWN\]\]/g
  while ((match = mdTableRegex.exec(text)) !== null) {
    markers.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'markdown-table',
      content: match[1].trim(),
      visibleInPreview: false,
    })
  }

  const imageRegex = /\[\[IMAGE\]\]([\s\S]*?)\[\[\/IMAGE\]\]/g
  while ((match = imageRegex.exec(text)) !== null) {
    markers.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'image',
      content: match[1].trim(),
      visibleInPreview: true,
    })
  }

  // Sort markers by position
  markers.sort((a, b) => a.start - b.start)

  // Walk through text linearly, creating blocks
  let cursor = 0

  // Skip metadata lines at the very beginning
  if (metaLines.length > 0) {
    const lastMetaLine = metaLines[metaLines.length - 1]
    let charCount = 0
    for (let i = 0; i <= lastMetaLine; i++) {
      charCount += lines[i].length + 1 // +1 for \n
    }
    cursor = charCount
  }

  const addTextBlocks = (rawText: string) => {
    const trimmed = rawText.trim()
    if (!trimmed) return

    const paragraphLines: string[] = []
    const listLines: string[] = []

    const flushParagraph = () => {
      if (paragraphLines.length === 0) return

      blocks.push({
        id: `block-${blockIdx}`,
        index: blockIdx++,
        type: 'paragraph',
        label: 'Paragraph',
        content: paragraphLines.join(' '),
      })
      paragraphLines.length = 0
    }

    const flushList = () => {
      if (listLines.length === 0) return

      blocks.push({
        id: `block-${blockIdx}`,
        index: blockIdx++,
        type: 'list',
        label: 'List',
        content: listLines.join('\n'),
      })
      listLines.length = 0
    }

    const flushInlineContent = () => {
      flushParagraph()
      flushList()
    }

    for (const line of trimmed.split('\n')) {
      const cleaned = line.trim()
      if (!cleaned) {
        flushInlineContent()
        continue
      }

      const isPageMarker = /^---\s*페이지/.test(cleaned)
      const headingMatch = /^(#{1,6})\s+(.+)$/.exec(cleaned)
      const listMatch = /^[-*]\s+(.+)$/.exec(cleaned)

      if (isPageMarker || headingMatch) {
        flushInlineContent()
        blocks.push({
          id: `block-${blockIdx}`,
          index: blockIdx++,
          type: 'header',
          label: isPageMarker ? 'Page' : 'Heading',
          content: headingMatch?.[2].trim() ?? cleaned,
        })
        continue
      }

      if (listMatch) {
        flushParagraph()
        listLines.push(listMatch[1].trim())
        continue
      }

      flushList()
      paragraphLines.push(cleaned)
    }

    flushInlineContent()
  }

  for (const marker of markers) {
    // Add any text before this marker
    if (marker.start > cursor) {
      addTextBlocks(text.slice(cursor, marker.start))
    }

    if (marker.visibleInPreview) {
      const typeLabels: Record<string, string> = {
        table: 'Table',
        'markdown-table': 'Table',
        image: 'Image',
      }

      blocks.push({
        id: `block-${blockIdx}`,
        index: blockIdx++,
        type: marker.type,
        label: typeLabels[marker.type],
        content: marker.content,
        htmlContent: marker.type === 'table' ? marker.content : undefined,
      })
    }

    cursor = marker.end
  }

  // Add any remaining text after last marker
  if (cursor < text.length) {
    addTextBlocks(text.slice(cursor))
  }

  return { metadata, blocks, rawText: text }
}

/** Build a JSON representation of the parsed document */
export function buildJsonView(doc: ParsedDocument): string {
  const structured = {
    metadata: doc.metadata,
    blocks: doc.blocks.map((b) => ({
      index: b.index,
      type: b.type,
      label: b.label,
      content: b.content,
    })),
  }
  return JSON.stringify(structured, null, 2)
}
