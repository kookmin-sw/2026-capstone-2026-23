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
    expect(
      screen.getByRole('button', { name: /변환 실행/ }),
    ).toBeInTheDocument()
  })

  it('파일이 없으면 변환 버튼이 비활성화된다', () => {
    render(<ActionButtons {...defaultProps} hasFiles={false} />)
    expect(screen.getByRole('button', { name: /변환 실행/ })).toBeDisabled()
  })

  it('변환 중이면 변환 버튼이 비활성화되고 텍스트가 변경된다', () => {
    render(<ActionButtons {...defaultProps} isConverting={true} />)
    expect(screen.getByRole('button', { name: /변환 중/ })).toBeDisabled()
  })

  it('변환 중이 아니면 중지 버튼이 비활성화된다', () => {
    render(<ActionButtons {...defaultProps} isConverting={false} />)
    expect(screen.getByRole('button', { name: /중지/ })).toBeDisabled()
  })

  it('변환 중이면 이어서 버튼이 비활성화된다', () => {
    render(<ActionButtons {...defaultProps} isConverting={true} />)
    expect(screen.getByRole('button', { name: /이어서/ })).toBeDisabled()
  })

  it('변환 실행 클릭 시 onConvert가 호출된다', () => {
    const onConvert = vi.fn()
    render(<ActionButtons {...defaultProps} onConvert={onConvert} />)
    fireEvent.click(screen.getByRole('button', { name: /변환 실행/ }))
    expect(onConvert).toHaveBeenCalledOnce()
  })

  it('중지 클릭 시 onStop이 호출된다', () => {
    const onStop = vi.fn()
    render(
      <ActionButtons {...defaultProps} isConverting={true} onStop={onStop} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /중지/ }))
    expect(onStop).toHaveBeenCalledOnce()
  })
})
