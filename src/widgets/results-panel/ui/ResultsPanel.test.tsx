import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsPanel } from './ResultsPanel'

describe('ResultsPanel', () => {
  it('파일 미선택 시 워크플로우 안내가 표시된다', () => {
    render(<ResultsPanel selectedFile="" />)
    expect(screen.getByText('문서 업로드')).toBeInTheDocument()
    expect(screen.getByText('AI 변환')).toBeInTheDocument()
    expect(screen.getByText('결과 확인')).toBeInTheDocument()
  })

  it('빈 상태에서 워크플로우 아이콘이 렌더링된다', () => {
    render(<ResultsPanel selectedFile="" />)
    const iconBoxes = document.querySelectorAll('.rounded-2xl.h-14.w-14')
    expect(iconBoxes.length).toBe(3)
  })

  it('로딩 중이면 스피너와 안내 텍스트가 표시된다', () => {
    render(<ResultsPanel selectedFile="test" isLoading={true} />)
    expect(screen.getByText('변환 결과를 불러오는 중...')).toBeInTheDocument()
  })

  it('에러 발생 시 에러 메시지가 표시된다', () => {
    render(
      <ResultsPanel
        selectedFile="test"
        documentResult={{
          documentId: 'd1',
          status: 'FAILED',
          fileName: 'test.pdf',
          modelCode: 'gpt-5-mini',
          error: { code: 'INTERNAL_ERROR', message: '서버 오류' },
          txt: { path: '', preview: '' },
          htmlPreview: null,
          markdown: null,
          imageDescriptions: [],
          meta: {},
        }}
      />,
    )
    expect(screen.getByText('변환 실패')).toBeInTheDocument()
    expect(screen.getByText('서버 오류')).toBeInTheDocument()
  })

  it('결과가 있으면 미리보기 제목이 표시된다', () => {
    render(
      <ResultsPanel
        selectedFile="test"
        documentResult={{
          documentId: 'd1',
          status: 'COMPLETED',
          fileName: 'test.pdf',
          modelCode: 'gpt-5-mini',
          error: null,
          txt: {
            path: '/output/test.txt',
            preview: '테스트 본문 내용입니다.',
          },
          htmlPreview: null,
          markdown: null,
          imageDescriptions: [],
          meta: {},
        }}
      />,
    )
    expect(screen.getByText('변환 결과 미리보기')).toBeInTheDocument()
    expect(screen.getByText('gpt-5-mini')).toBeInTheDocument()
  })

  it('onFilesAdded 전달 시 파일 선택 버튼이 표시된다', () => {
    render(<ResultsPanel selectedFile="" onFilesAdded={() => {}} />)
    expect(screen.getByText('파일 선택')).toBeInTheDocument()
    expect(screen.getByText('폴더 선택')).toBeInTheDocument()
  })
})
