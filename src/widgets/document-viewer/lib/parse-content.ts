/** Sequential content block — represents one piece of the parsed document */
export interface ContentBlock {
  id: string
  index: number
  type: 'header' | 'paragraph' | 'table' | 'markdown-table' | 'image'
  label: string
  content: string
  htmlContent?: string
}

export interface ParsedDocument {
  metadata: { originalPath?: string; pageCount?: number }
  blocks: ContentBlock[]
  rawText: string
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
    })
  }

  const imageRegex = /\[\[IMAGE\]\]([\s\S]*?)\[\[\/IMAGE\]\]/g
  while ((match = imageRegex.exec(text)) !== null) {
    markers.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'image',
      content: match[1].trim(),
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

    // Split into paragraphs by double newlines or page markers
    const paragraphs = trimmed.split(/\n{2,}|(?=---\s*페이지)/)

    for (const para of paragraphs) {
      const cleaned = para.trim()
      if (!cleaned) continue

      // Detect if it's a header/heading line (short, no period, possibly starts with page marker)
      const isPageMarker = /^---\s*페이지/.test(cleaned)
      if (isPageMarker) {
        blocks.push({
          id: `block-${blockIdx}`,
          index: blockIdx++,
          type: 'header',
          label: 'Page',
          content: cleaned,
        })
        continue
      }

      // Short lines without punctuation are likely headings
      const isHeading = cleaned.length < 80 && !cleaned.includes('.')
      blocks.push({
        id: `block-${blockIdx}`,
        index: blockIdx++,
        type: isHeading ? 'header' : 'paragraph',
        label: isHeading ? 'Heading' : 'Paragraph',
        content: cleaned,
      })
    }
  }

  for (const marker of markers) {
    // Add any text before this marker
    if (marker.start > cursor) {
      addTextBlocks(text.slice(cursor, marker.start))
    }

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
