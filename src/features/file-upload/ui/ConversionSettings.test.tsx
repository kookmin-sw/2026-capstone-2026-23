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
  modelId: 'm1',
  onModelIdChange: vi.fn(),
  parallelCount: 1,
  onParallelCountChange: vi.fn(),
  isPreferredModel: false,
  onPreferredModelChange: vi.fn(),
  overwriteMode: 'OVERWRITE' as const,
  onOverwriteModeChange: vi.fn(),
}

describe('ConversionSettings', () => {
  it('VLM 모델 선택 라벨이 렌더링된다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    expect(screen.getByText('VLM 모델 선택')).toBeInTheDocument()
  })

  it('병렬 처리 수 입력이 렌더링된다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    expect(screen.getByText('병렬 처리 수')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })

  it('중복 파일 처리 라디오 버튼이 렌더링된다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    expect(screen.getByText('강제 덮어쓰기')).toBeInTheDocument()
    expect(
      screen.getByText('새로운 파일로 생성 (타임스탬프 추가)'),
    ).toBeInTheDocument()
  })

  it('OVERWRITE가 기본 선택된다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    const overwriteRadio = screen.getByDisplayValue('OVERWRITE')
    expect(overwriteRadio).toBeChecked()
  })

  it('라디오 버튼에 accent-primary 클래스가 없다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => {
      expect(radio.className).not.toContain('accent-primary')
    })
  })

  it('체크박스에 accent-primary 클래스가 없다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox.className).not.toContain('accent-primary')
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
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '4' } })
    expect(onParallelCountChange).toHaveBeenCalledWith(4)
  })

  it('select와 input에 rounded-lg 클래스가 적용되어 있다', () => {
    render(<ConversionSettings {...defaultProps} />, {
      wrapper: createWrapper(),
    })
    const numberInput = screen.getByDisplayValue('1')
    expect(numberInput.className).toContain('rounded-lg')
  })
})
