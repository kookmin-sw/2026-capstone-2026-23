import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConversionSettings } from './ConversionSettings'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const defaultProps = {
  modelId: 'm4',
  onModelIdChange: vi.fn(),
  parallelCount: 1,
  onParallelCountChange: vi.fn(),
  isPreferredModel: false,
  onPreferredModelChange: vi.fn(),
  overwriteMode: 'OVERWRITE' as const,
  onOverwriteModeChange: vi.fn(),
}

describe('ConversionSettings', () => {
  it('변환 설정 토글이 렌더링된다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    expect(screen.getByText('변환 설정')).toBeInTheDocument()
  })

  it('기본적으로 접혀있다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    expect(screen.queryByText('VLM 모델')).not.toBeInTheDocument()
  })

  it('클릭하면 설정이 펼쳐진다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    fireEvent.click(screen.getByText('변환 설정'))
    expect(screen.getByText('VLM 모델')).toBeInTheDocument()
    expect(screen.getByText('병렬 처리')).toBeInTheDocument()
    expect(screen.getByText('덮어쓰기')).toBeInTheDocument()
  })

  it('OVERWRITE가 기본 선택된다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    fireEvent.click(screen.getByText('변환 설정'))
    expect(screen.getByDisplayValue('OVERWRITE')).toBeChecked()
  })

  it('다시 클릭하면 접힌다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    fireEvent.click(screen.getByText('변환 설정'))
    expect(screen.getByText('VLM 모델')).toBeInTheDocument()
    fireEvent.click(screen.getByText('변환 설정'))
    expect(screen.queryByText('VLM 모델')).not.toBeInTheDocument()
  })

  it('병렬 처리 수 변경 시 콜백이 호출된다', () => {
    const onParallelCountChange = vi.fn()
    render(
      <ConversionSettings
        {...defaultProps}
        onParallelCountChange={onParallelCountChange}
      />,
      { wrapper: createWrapper() },
    )
    fireEvent.click(screen.getByText('변환 설정'))
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '4' } })
    expect(onParallelCountChange).toHaveBeenCalledWith(4)
  })
})
