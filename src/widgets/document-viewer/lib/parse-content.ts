export interface ParsedSection {
  id: string
  type: 'html-table' | 'markdown-table' | 'image' | 'text'
  label: string
  preview: string
  data: HtmlTableData | MarkdownTableData | ImageData | TextData
}

export interface HtmlTableData {
  html: string
}

export interface MarkdownTableData {
  title: string
  headerPath: string[]
  rows: string[]
}

export interface ImageData {
  description: string
}

export interface TextData {
  text: string
}

export interface ParsedDocument {
  metadata: { originalPath?: string; pageCount?: number }
  sections: ParsedSection[]
  rawText: string
}

export function parseDocumentContent(text: string): ParsedDocument {
  const lines = text.split('\n')
  const metadata: ParsedDocument['metadata'] = {}
  const sections: ParsedSection[] = []

  lines.slice(0, 3).forEach((line) => {
    if (line.includes('원본 파일 경로:'))
      metadata.originalPath = line.split(':').slice(1).join(':').trim()
    else if (line.includes('페이지 수:'))
      metadata.pageCount = parseInt(line.split(':')[1].trim())
  })

  let match: RegExpExecArray | null
  let sectionId = 0

  // HTML Tables
  const htmlTableRegex = /\[\[TABLE\]\]([\s\S]*?)\[\[\/TABLE\]\]/g
  while ((match = htmlTableRegex.exec(text)) !== null) {
    const html = match[1].trim()
    sections.push({
      id: `section-${sectionId++}`,
      type: 'html-table',
      label: `HTML 표 ${sectionId}`,
      preview: html.replace(/<[^>]*>/g, '').slice(0, 80) + '…',
      data: { html } as HtmlTableData,
    })
  }

  // Markdown Tables
  const markdownTableRegex =
    /\[\[TABLE_MARKDOWN\]\]([\s\S]*?)\[\[\/TABLE_MARKDOWN\]\]/g
  while ((match = markdownTableRegex.exec(text)) !== null) {
    const tableContent = match[1].trim()
    const titleMatch = tableContent.match(/# TableTitle: (.+)/)
    const title = titleMatch ? titleMatch[1] : `마크다운 표`
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
    sections.push({
      id: `section-${sectionId++}`,
      type: 'markdown-table',
      label: title,
      preview: rows.slice(0, 2).join(' / ').slice(0, 80) + '…',
      data: { title, headerPath, rows } as MarkdownTableData,
    })
  }

  // Image Descriptions
  const imageRegex = /\[\[IMAGE\]\]([\s\S]*?)\[\[\/IMAGE\]\]/g
  let imageIdx = 1
  while ((match = imageRegex.exec(text)) !== null) {
    const description = match[1].trim()
    sections.push({
      id: `section-${sectionId++}`,
      type: 'image',
      label: `이미지 ${imageIdx++}`,
      preview: description.slice(0, 80) + '…',
      data: { description } as ImageData,
    })
  }

  // Plain text (everything with markers stripped)
  const plainText = text
    .replace(/\[\[TABLE\]\][\s\S]*?\[\[\/TABLE\]\]/g, '')
    .replace(/\[\[TABLE_MARKDOWN\]\][\s\S]*?\[\[\/TABLE_MARKDOWN\]\]/g, '')
    .replace(/\[\[IMAGE\]\][\s\S]*?\[\[\/IMAGE\]\]/g, '')
    .trim()

  if (plainText) {
    sections.push({
      id: `section-${sectionId++}`,
      type: 'text',
      label: '텍스트',
      preview: plainText.slice(0, 80) + '…',
      data: { text: plainText } as TextData,
    })
  }

  return { metadata, sections, rawText: text }
}

/** Build a JSON representation of the parsed document */
export function buildJsonView(doc: ParsedDocument): string {
  const structured = {
    metadata: doc.metadata,
    sections: doc.sections.map((s) => ({
      type: s.type,
      label: s.label,
      ...(s.data as Record<string, unknown>),
    })),
  }
  return JSON.stringify(structured, null, 2)
}

/** Build a Markdown representation */
export function buildMarkdownView(doc: ParsedDocument): string {
  const lines: string[] = []
  if (doc.metadata.originalPath)
    lines.push(`> 원본: ${doc.metadata.originalPath}`)
  if (doc.metadata.pageCount) lines.push(`> 페이지: ${doc.metadata.pageCount}`)
  if (lines.length) lines.push('')

  for (const section of doc.sections) {
    if (section.type === 'html-table') {
      const d = section.data as HtmlTableData
      lines.push(`## ${section.label}`, '', '```html', d.html, '```', '')
    } else if (section.type === 'markdown-table') {
      const d = section.data as MarkdownTableData
      lines.push(`## ${d.title}`, '')
      if (d.headerPath.length) {
        lines.push('**HeaderPath:**')
        d.headerPath.forEach((p) => lines.push(`- ${p}`))
        lines.push('')
      }
      lines.push('**데이터:**')
      d.rows.forEach((r) => lines.push(`- ${r}`))
      lines.push('')
    } else if (section.type === 'image') {
      const d = section.data as ImageData
      lines.push(`## ${section.label}`, '', d.description, '')
    } else if (section.type === 'text') {
      const d = section.data as TextData
      lines.push(`## 텍스트`, '', d.text, '')
    }
  }
  return lines.join('\n')
}
