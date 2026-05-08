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
  it('TABLE_MARKDOWN 블록은 preview 블록에서 제외한다', () => {
    const content = buildDocumentContentText({
      txt: { preview: '본문' },
      markdown: '# TableTitle: 표 제목',
    })
    const parsed = parseDocumentContent(content)

    expect(parsed.blocks.some((block) => block.type === 'markdown-table')).toBe(
      false,
    )
    expect(parsed.rawText).toContain('[[TABLE_MARKDOWN]]')
    expect(parsed.rawText).toContain('# TableTitle: 표 제목')
  })

  it('TABLE HTML은 유지하고 TABLE_MARKDOWN 설명은 제외한다', () => {
    const parsed = parseDocumentContent(`[[TABLE]]
<table><tr><td>196,700</td></tr></table>
[[/TABLE]]

[[TABLE_MARKDOWN]]
# TableTitle: 자산중위값 변화표

## 데이터 (사실 문장)
- Row=총자산중위값, Col=2006~2008: 196,700
[[/TABLE_MARKDOWN]]`)

    expect(parsed.blocks).toHaveLength(1)
    expect(parsed.blocks[0].type).toBe('table')
    expect(parsed.blocks[0].htmlContent).toContain('<table>')
    expect(parsed.blocks[0].content).not.toContain('TableTitle')
  })

  it('일반 preview 텍스트의 markdown heading과 list를 구조화한다', () => {
    const parsed = parseDocumentContent(`## Page 1
분기별 운영 현황 검토
실제 업무 문서에서는 표 주변에 설명 문장이 함께 포함되는 경우가 많다.

- 첫 번째 항목
- 두 번째 항목`)

    expect(parsed.blocks).toHaveLength(3)
    expect(parsed.blocks[0]).toMatchObject({
      type: 'header',
      content: 'Page 1',
    })
    expect(parsed.blocks[1]).toMatchObject({
      type: 'paragraph',
      content:
        '분기별 운영 현황 검토\n실제 업무 문서에서는 표 주변에 설명 문장이 함께 포함되는 경우가 많다.',
    })
    expect(parsed.blocks[2]).toMatchObject({
      type: 'list',
      content: '첫 번째 항목\n두 번째 항목',
    })
    expect(
      parsed.blocks.map((block) => block.content).join('\n'),
    ).not.toContain('##')
  })

  it('IMAGE 블록 안의 줄바꿈을 보존한다', () => {
    const parsed = parseDocumentContent(`## Page 1
[[IMAGE]]
PDF 구조 파싱에서 VLM 파이프라인의 효과 분석
강아영, 김동연, 김동진
요 약
본문 첫 문장입니다.
본문 둘째 문장입니다.
[[/IMAGE]]`)

    expect(parsed.blocks).toHaveLength(2)
    expect(parsed.blocks[1]).toMatchObject({
      type: 'image',
      content:
        'PDF 구조 파싱에서 VLM 파이프라인의 효과 분석\n강아영, 김동연, 김동진\n요 약\n본문 첫 문장입니다.\n본문 둘째 문장입니다.',
    })
  })
})
