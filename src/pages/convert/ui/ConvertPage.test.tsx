import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ConvertPage } from './ConvertPage'

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@/widgets/conversion-panel', () => ({
  ConversionPanel: () => <div data-testid="conversion-panel" />,
}))

vi.mock('@/widgets/results-panel', () => ({
  ResultsPanel: () => <div data-testid="results-panel" />,
}))

vi.mock('@/widgets/chat-modal', () => ({
  ChatModal: () => null,
}))

vi.mock('@/features/file-upload', () => ({
  useUploadStore: () => ({
    selectedResultPath: '',
    files: [],
  }),
}))

vi.mock('@/app/model/ui-store', () => ({
  useUIStore: () => ({
    isChatOpen: false,
    setIsChatOpen: vi.fn(),
  }),
}))

vi.mock('@/entities/document', () => ({
  useDocumentResult: () => ({ data: undefined, isLoading: false }),
}))

describe('ConvertPage', () => {
  it('ConversionPanel과 ResultsPanel이 렌더링된다', () => {
    const { getByTestId } = render(<ConvertPage />)
    expect(getByTestId('conversion-panel')).toBeInTheDocument()
    expect(getByTestId('results-panel')).toBeInTheDocument()
  })

  it('레이아웃에 flex gap-6이 적용된다', () => {
    const { container } = render(<ConvertPage />)
    const flexContainer = container.querySelector('.flex.gap-6')
    expect(flexContainer).not.toBeNull()
  })

  it('좌측 패널에 w-2/5 클래스가 적용된다', () => {
    const { getByTestId } = render(<ConvertPage />)
    const leftPanel = getByTestId('conversion-panel').parentElement
    expect(leftPanel?.className).toContain('w-2/5')
  })

  it('우측 패널에 flex-1 클래스가 적용된다', () => {
    const { getByTestId } = render(<ConvertPage />)
    const rightPanel = getByTestId('results-panel').parentElement
    expect(rightPanel?.className).toContain('flex-1')
  })

  it('selectedResultPath가 없으면 AI 질의응답 버튼이 표시되지 않는다', () => {
    const { container } = render(<ConvertPage />)
    const aiButton = container.querySelector('button.fixed')
    expect(aiButton).toBeNull()
  })
})
