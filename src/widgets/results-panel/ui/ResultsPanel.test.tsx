import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsPanel } from './ResultsPanel'

describe('ResultsPanel', () => {
  it('파일 미선택 시 안내 텍스트가 표시된다', () => {
    render(<ResultsPanel selectedFile="" />)
    expect(screen.getByText('변환 결과 미리보기')).toBeInTheDocument()
    expect(
      screen.getByText(/좌측에서 파일을 업로드하고 변환하면/),
    ).toBeInTheDocument()
  })

  it('빈 상태에서 아이콘 박스에 bg-accent 클래스가 적용된다', () => {
    render(<ResultsPanel selectedFile="" />)
    const iconBox = document.querySelector('.bg-accent.rounded-2xl')
    expect(iconBox).not.toBeNull()
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
          fileName: 'test.pdf',
          modelCode: 'gpt-5-mini',
          error: { message: '서버 오류' },
          txt: null,
          json: null,
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
          fileName: 'test.pdf',
          modelCode: 'gpt-5-mini',
          error: null,
          txt: { preview: '테스트 본문 내용입니다.' },
          json: null,
        }}
      />,
    )
    expect(screen.getByText('변환 결과 미리보기')).toBeInTheDocument()
    expect(screen.getByText('gpt-5-mini')).toBeInTheDocument()
  })

  it('Card에 flex-1 클래스가 적용된다', () => {
    render(<ResultsPanel selectedFile="" />)
    const card = document.querySelector('[data-slot="card"]')
    expect(card?.className).toContain('flex-1')
  })
})
