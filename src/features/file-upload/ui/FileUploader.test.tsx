import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileUploader } from './FileUploader'

describe('FileUploader', () => {
  it('렌더링 시 업로드 안내 텍스트가 표시된다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    expect(
      screen.getByText('클릭하거나 파일을 드래그하여 업로드'),
    ).toBeInTheDocument()
  })

  it('지원 파일 형식이 표시된다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    expect(
      screen.getByText('HWP, HWPX, PDF, PNG, JPG, BMP, TIFF'),
    ).toBeInTheDocument()
  })

  it('폴더 업로드 버튼이 존재한다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: /폴더 전체 업로드/ }),
    ).toBeInTheDocument()
  })

  it('드래그 시 안내 텍스트가 변경된다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    const dropZone = screen
      .getByText('클릭하거나 파일을 드래그하여 업로드')
      .closest('div[class*="border-dashed"]')!

    fireEvent.dragOver(dropZone, { preventDefault: vi.fn() })
    expect(screen.getByText('파일을 여기에 놓으세요')).toBeInTheDocument()
  })

  it('드롭존에 rounded-xl 클래스가 적용되어 있다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    const dropZone = screen
      .getByText('클릭하거나 파일을 드래그하여 업로드')
      .closest('div[class*="border-dashed"]')!

    expect(dropZone.className).toContain('rounded-xl')
  })
})
