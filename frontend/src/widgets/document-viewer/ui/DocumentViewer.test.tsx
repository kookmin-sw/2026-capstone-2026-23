import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DocumentViewer } from './DocumentViewer'

const DOCUMENT_RESULT = {
  documentId: 'd1',
  status: 'COMPLETED',
  fileName: 'document.pdf',
  modelCode: 'gpt-5-mini',
  error: null,
  txt: {
    path: '/output/document.txt',
    preview: `## Page 1

<table><tr><td>셀</td></tr></table>`,
  },
  htmlPreview: null,
  markdown: null,
  imageDescriptions: [],
  meta: {},
} as const

describe('DocumentViewer', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('IMAGE 블록 내부의 markdown을 preview에서 렌더링한다', () => {
    render(
      <DocumentViewer
        documentResult={{
          documentId: 'd1',
          status: 'COMPLETED',
          fileName: 'image.png',
          modelCode: 'gpt-5-mini',
          error: null,
          txt: {
            path: '/output/image.txt',
            preview: `## Page 1
[[IMAGE]]
# 이미지 제목: 제1장 일반사항

## 주요 내용
- **제목**: 제1장 일반사항
- **본문**:
  - **1 목 적**
[[/IMAGE]]`,
          },
          htmlPreview: null,
          markdown: null,
          imageDescriptions: [],
          meta: {},
        }}
      />,
    )

    expect(
      screen.queryByText('# 이미지 제목: 제1장 일반사항'),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: '이미지 제목: 제1장 일반사항',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '주요 내용' }),
    ).toBeInTheDocument()

    const titleItem = screen.getByText(': 제1장 일반사항').closest('li')
    expect(titleItem).toBeInTheDocument()
    expect(within(titleItem!).getByText('제목').tagName).toBe('STRONG')
  })

  it('페이지 헤더를 일반 heading보다 큰 페이지 구분자로 렌더링한다', () => {
    render(
      <DocumentViewer
        documentResult={{
          documentId: 'd1',
          status: 'COMPLETED',
          fileName: 'document.pdf',
          modelCode: 'gpt-5-mini',
          error: null,
          txt: {
            path: '/output/document.txt',
            preview: `## Page 1

## 문서 제목`,
          },
          htmlPreview: null,
          markdown: null,
          imageDescriptions: [],
          meta: {},
        }}
      />,
    )

    const pageHeader = screen.getByText('Page 1')
    expect(pageHeader.className).toContain('text-lg')
    expect(screen.getByText('문서 제목').className).toContain('text-base')
  })

  it('Clipboard API가 실패하면 execCommand fallback으로 복사한다', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('not allowed')),
      },
    })
    const execCommand = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    })

    render(<DocumentViewer documentResult={DOCUMENT_RESULT} />)

    fireEvent.click(screen.getByRole('button', { name: 'HTML' }))
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

    await waitFor(() => expect(execCommand).toHaveBeenCalledWith('copy'))
  })
})
