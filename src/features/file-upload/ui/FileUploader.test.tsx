import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileUploader } from './FileUploader'

describe('FileUploader', () => {
  it('업로드 안내 텍스트가 표시된다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    expect(screen.getByText('파일을 드래그하여 업로드')).toBeInTheDocument()
  })

  it('지원 파일 형식이 표시된다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    expect(
      screen.getByText('HWP, HWPX, PDF, Excel, CSV, PNG, JPG, BMP, TIFF'),
    ).toBeInTheDocument()
  })

  it('파일 선택과 폴더 선택 버튼이 모두 존재한다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    expect(screen.getByText('파일 선택')).toBeInTheDocument()
    expect(screen.getByText('폴더 선택')).toBeInTheDocument()
  })

  it('드래그 시 안내 텍스트가 변경된다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    const dropZone = screen
      .getByText('파일을 드래그하여 업로드')
      .closest('div[class*="border-dashed"]')!

    fireEvent.dragOver(dropZone, { preventDefault: vi.fn() })
    expect(screen.getByText('여기에 놓으세요')).toBeInTheDocument()
  })

  it('드롭존에 rounded-2xl 클래스가 적용되어 있다', () => {
    render(<FileUploader onFilesAdded={vi.fn()} />)
    const dropZone = screen
      .getByText('파일을 드래그하여 업로드')
      .closest('div[class*="border-dashed"]')!

    expect(dropZone.className).toContain('rounded-2xl')
  })
})
