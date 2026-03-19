import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActionButtons } from './ActionButtons'

const defaultProps = {
  onConvert: vi.fn(),
  onStop: vi.fn(),
  onResume: vi.fn(),
  isConverting: false,
  hasFiles: true,
}

describe('ActionButtons', () => {
  it('변환 실행 버튼이 렌더링된다', () => {
    render(<ActionButtons {...defaultProps} />)
    expect(screen.getByText('변환 실행')).toBeInTheDocument()
  })

  it('파일이 없으면 변환 버튼이 비활성화된다', () => {
    render(<ActionButtons {...defaultProps} hasFiles={false} />)
    expect(screen.getByText('변환 실행').closest('button')).toBeDisabled()
  })

  it('변환 중이면 텍스트가 변경된다', () => {
    render(<ActionButtons {...defaultProps} isConverting={true} />)
    expect(screen.getByText('변환 중...')).toBeInTheDocument()
  })

  it('변환 실행 클릭 시 onConvert가 호출된다', () => {
    const onConvert = vi.fn()
    render(<ActionButtons {...defaultProps} onConvert={onConvert} />)
    fireEvent.click(screen.getByText('변환 실행').closest('button')!)
    expect(onConvert).toHaveBeenCalledOnce()
  })

  it('중지 클릭 시 onStop이 호출된다', () => {
    const onStop = vi.fn()
    render(
      <ActionButtons {...defaultProps} isConverting={true} onStop={onStop} />,
    )
    fireEvent.click(screen.getByText('중지').closest('button')!)
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('이어서 클릭 시 onResume이 호출된다', () => {
    const onResume = vi.fn()
    render(<ActionButtons {...defaultProps} onResume={onResume} />)
    fireEvent.click(screen.getByText('이어서').closest('button')!)
    expect(onResume).toHaveBeenCalledOnce()
  })
})
