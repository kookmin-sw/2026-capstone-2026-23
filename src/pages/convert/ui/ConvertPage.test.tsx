import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ConvertPage } from './ConvertPage'

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@/widgets/conversion-panel', () => ({
  ConversionPanel: () => <div data-testid="conversion-panel" />,
  useConversionLogic: () => ({
    files: [],
    modelId: 'm1',
    parallelCount: 1,
    isConverting: false,
    batchStatus: '',
    batchStatusType: null,
    selectedResultPath: '',
    isPreferredModel: false,
    overwriteMode: 'OVERWRITE',
    isMockMode: false,
    selectedFile: undefined,
    completedCount: 0,
    totalCount: 0,
    overallProgress: 0,
    hasFiles: false,
    addFiles: vi.fn(),
    removeFile: vi.fn(),
    handleFileSelect: vi.fn(),
    handleConvert: vi.fn(),
    handleStop: vi.fn(),
    handleResume: vi.fn(),
    setModelId: vi.fn(),
    setParallelCount: vi.fn(),
    setIsPreferredModel: vi.fn(),
    setOverwriteMode: vi.fn(),
    setIsMockMode: vi.fn(),
    setSelectedResultPath: vi.fn(),
  }),
}))

vi.mock('@/widgets/document-viewer', () => ({
  DocumentViewer: () => <div data-testid="document-viewer" />,
}))

vi.mock('@/widgets/chat-modal', () => ({
  ChatModal: () => null,
}))

vi.mock('@/widgets/floating-control-panel', () => ({
  FloatingControlPanel: () => <div data-testid="floating-control-panel" />,
}))

vi.mock('@/features/file-upload', () => ({
  useUploadStore: () => ({
    selectedResultPath: '',
    files: [],
    isMockMode: false,
    isConverting: false,
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

vi.mock('@/shared/lib/mock-document-result', () => ({
  MOCK_DOCUMENT_RESULT: undefined,
}))

describe('ConvertPage', () => {
  it('FloatingControlPanel이 렌더링된다', () => {
    const { getByTestId } = render(<ConvertPage />)
    expect(getByTestId('floating-control-panel')).toBeInTheDocument()
  })

  it('selectedResultPath가 없으면 빈 상태가 표시된다', () => {
    const { getByText } = render(<ConvertPage />)
    expect(getByText('문서 업로드')).toBeInTheDocument()
  })

  it('selectedResultPath가 없으면 AI 질의응답 버튼이 표시되지 않는다', () => {
    const { container } = render(<ConvertPage />)
    const aiButton = container.querySelector('button.fixed')
    expect(aiButton).toBeNull()
  })
})
