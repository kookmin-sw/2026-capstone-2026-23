import { describe, expect, it } from 'vitest'

import { buildDocumentContentText, parseDocumentContent } from './parse-content'

describe('buildDocumentContentText', () => {
  it('txt preview에 없는 markdown 필드를 TABLE_MARKDOWN 블록으로 병합한다', () => {
    const content = buildDocumentContentText({
      txt: { preview: '본문\n\n[[TABLE]]<table></table>[[/TABLE]]' },
      markdown: '# TableTitle: 표 제목\n\n## 데이터\n- 행 설명',
    })

    expect(content).toContain('[[TABLE]]<table></table>[[/TABLE]]')
    expect(content).toContain('[[TABLE_MARKDOWN]]')
    expect(content).toContain('# TableTitle: 표 제목')
    expect(content).toContain('[[/TABLE_MARKDOWN]]')
  })

  it('markdown 객체/배열 응답에서도 markdown 문자열을 추출한다', () => {
    const content = buildDocumentContentText({
      txt: { preview: '본문' },
      markdown: {
        tables: [
          { markdown: '# TableTitle: 첫 표' },
          { markdownSection: '# TableTitle: 둘째 표' },
        ],
      },
    })

    expect(content).toContain('# TableTitle: 첫 표')
    expect(content).toContain('# TableTitle: 둘째 표')
  })

  it('preview에 TABLE_MARKDOWN 블록이 이미 있으면 중복 병합하지 않는다', () => {
    const preview =
      '본문\n\n[[TABLE_MARKDOWN]]\n# TableTitle: 기존 표\n[[/TABLE_MARKDOWN]]'

    expect(
      buildDocumentContentText({
        txt: { preview },
        markdown: '# TableTitle: 기존 표',
      }),
    ).toBe(preview)
  })

  it('preview에 없는 markdown은 기존 TABLE_MARKDOWN 블록이 있어도 추가한다', () => {
    const content = buildDocumentContentText({
      txt: {
        preview:
          '본문\n\n[[TABLE_MARKDOWN]]\n# TableTitle: 기존 표\n[[/TABLE_MARKDOWN]]',
      },
      markdown: '# TableTitle: 추가 표',
    })

    expect(content).toContain('# TableTitle: 기존 표')
    expect(content).toContain('# TableTitle: 추가 표')
  })
})

describe('parseDocumentContent', () => {
  it('병합된 markdown 블록을 preview 블록으로 파싱한다', () => {
    const content = buildDocumentContentText({
      txt: { preview: '본문' },
      markdown: '# TableTitle: 표 제목',
    })
    const parsed = parseDocumentContent(content)

    expect(parsed.blocks.some((block) => block.type === 'markdown-table')).toBe(
      true,
    )
  })
})
