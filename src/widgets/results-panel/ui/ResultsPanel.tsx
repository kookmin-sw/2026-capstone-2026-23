import { useMemo } from 'react'
import { FileText, Table, Image, Code } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

interface ParsedContent {
  metadata: { originalPath?: string; pageCount?: number }
  htmlTables: { html: string }[]
  markdownTables: { title: string; headerPath: string[]; rows: string[] }[]
  imageDescriptions: { id: number; description: string }[]
  plainText: string
}

interface ResultsPanelProps {
  selectedFile: string
  convertedContent?: string
}

export function ResultsPanel({
  selectedFile,
  convertedContent,
}: ResultsPanelProps) {
  const content = useMemo<ParsedContent | null>(() => {
    if (selectedFile && convertedContent) {
      return parseConvertedContent(convertedContent)
    }
    return null
  }, [selectedFile, convertedContent])

  if (!selectedFile) {
    return (
      <Card className="h-full">
        <CardContent className="p-8 text-center h-full flex items-center justify-center">
          <div>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              변환된 파일을 선택하면 내용이 여기에 표시됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!content) {
    return (
      <Card className="h-full">
        <CardContent className="p-8 text-center h-full flex items-center justify-center">
          <div>
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-muted-foreground">
              변환 결과를 불러오는 중...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-y-auto">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          변환 결과 미리보기
        </h2>

        {/* Metadata */}
        <div className="mb-6 p-4 bg-muted/50 font-mono text-xs">
          <p>원본 파일 경로: {content.metadata.originalPath}</p>
          <p>페이지 수: {content.metadata.pageCount}</p>
        </div>

        {/* HTML Tables */}
        {content.htmlTables.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Table className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">HTML 미리보기</h3>
            </div>
            {content.htmlTables.map((table, idx) => (
              <div
                key={idx}
                className="mb-4 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: table.html }}
              />
            ))}
          </div>
        )}

        {/* Markdown Tables */}
        {content.markdownTables.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                Markdown 선형화
              </h3>
            </div>
            {content.markdownTables.map((table, idx) => (
              <div
                key={idx}
                className="mb-4 p-4 bg-muted/50 border-l-4 border-primary"
              >
                <h4 className="font-semibold text-primary mb-2">
                  # {table.title}
                </h4>
                <div className="mb-2">
                  <p className="text-sm font-medium text-foreground">
                    ## HeaderPath 구조
                  </p>
                  <ul className="ml-4 mt-1 space-y-1">
                    {table.headerPath.map((path, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        - {path.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    ## 데이터 (사실 문장)
                  </p>
                  <ul className="ml-4 mt-1 space-y-1">
                    {table.rows.map((row, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        - {row}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Descriptions */}
        {content.imageDescriptions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Image className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">이미지 설명</h3>
            </div>
            {content.imageDescriptions.map((img) => (
              <div
                key={img.id}
                className="mb-4 p-4 bg-muted/50 border-l-4 border-primary"
              >
                <p className="text-sm text-foreground whitespace-pre-line">
                  {img.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Plain Text */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">원본 텍스트</h3>
          <pre className="p-4 bg-muted/50 font-mono text-xs whitespace-pre-wrap overflow-x-auto">
            {content.plainText}
          </pre>
        </div>
      </CardContent>
    </Card>
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
      /## HeaderPath 구조([\s\S]*?)## 데이터/
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
      '[Markdown 표 생략]'
    )
    .replace(/\[\[IMAGE\]\][\s\S]*?\[\[\/IMAGE\]\]/g, '[이미지 설명 생략]')

  return { metadata, htmlTables, markdownTables, imageDescriptions, plainText }
}
