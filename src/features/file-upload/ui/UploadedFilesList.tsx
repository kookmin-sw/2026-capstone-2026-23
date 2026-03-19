import { useRef, useState } from 'react'
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Eye,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { FileTypeIcon } from '@/shared/ui/file-type-icon'
import type { UploadFileItem } from '../model/store'

interface UploadedFilesListProps {
  files: UploadFileItem[]
  onRemoveFile: (id: string) => void
  onFileSelect: (id: string) => void
  onFilesAdded: (files: File[]) => void
  selectedFileId?: string
  overallProgress: number
  onReset?: () => void
}

const ACCEPTED_EXTENSIONS = [
  '.hwp',
  '.hwpx',
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.bmp',
  '.tiff',
]

export function UploadedFilesList({
  files,
  onRemoveFile,
  onFileSelect,
  onFilesAdded,
  selectedFileId,
  overallProgress,
  onReset,
}: UploadedFilesListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const items = Array.from(e.dataTransfer.items)
    const droppedFiles: File[] = []

    const processEntry = async (entry: FileSystemEntry): Promise<void> => {
      return new Promise((resolve) => {
        if (entry.isFile) {
          ;(entry as FileSystemFileEntry).file((file: File) => {
            droppedFiles.push(file)
            resolve()
          })
        } else if (entry.isDirectory) {
          const dirReader = (entry as FileSystemDirectoryEntry).createReader()
          dirReader.readEntries(async (entries) => {
            for (const childEntry of entries) {
              await processEntry(childEntry)
            }
            resolve()
          })
        } else {
          resolve()
        }
      })
    }

    const processItems = async () => {
      for (const item of items) {
        const entry = item.webkitGetAsEntry?.()
        if (entry) {
          await processEntry(entry)
        } else if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) droppedFiles.push(file)
        }
      }
      if (droppedFiles.length > 0) {
        onFilesAdded(droppedFiles)
      }
    }

    processItems()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const getStatusDisplay = (file: UploadFileItem) => {
    switch (file.status) {
      case 'pending':
        return (
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            대기
          </span>
        )
      case 'converting':
        return (
          <span className="text-primary flex items-center gap-1 text-xs font-medium">
            <Loader2 className="h-3 w-3 animate-spin" />
            {file.currentPage && file.totalPages
              ? `${file.currentPage}/${file.totalPages}p`
              : `${file.progress ?? 0}%`}
          </span>
        )
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-[#198038]">
            <CheckCircle className="h-3 w-3" />
            완료
          </span>
        )
      case 'failed':
        return (
          <span className="text-destructive flex items-center gap-1 text-xs font-medium">
            <XCircle className="h-3 w-3" />
            실패
          </span>
        )
    }
  }

  const completedCount = files.filter((f) => f.status === 'completed').length
  const failedCount = files.filter((f) => f.status === 'failed').length
  const convertingCount = files.filter((f) => f.status === 'converting').length

  return (
    <div
      className="flex h-full flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Header with counts + add button */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h3 className="text-foreground text-sm font-semibold">
            {files.length}개 파일
          </h3>
          <div className="flex items-center gap-2 text-xs">
            {convertingCount > 0 && (
              <span className="text-primary font-medium">
                {convertingCount} 변환 중
              </span>
            )}
            {completedCount > 0 && (
              <span className="font-medium text-[#198038]">
                {completedCount} 완료
              </span>
            )}
            {failedCount > 0 && (
              <span className="text-destructive font-medium">
                {failedCount} 실패
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onReset && (
            <button
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
            >
              <RotateCcw className="h-3 w-3" />새 변환
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(',')}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onFilesAdded(Array.from(e.target.files))
            e.target.value = ''
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-expect-error webkitdirectory is valid but not in TS types
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onFilesAdded(Array.from(e.target.files))
            e.target.value = ''
          }}
        />
      </div>

      {/* Overall progress */}
      {convertingCount > 0 && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-muted-foreground text-xs">전체 진행률</span>
            <span className="text-foreground text-xs font-semibold tabular-nums">
              {overallProgress}%
            </span>
          </div>
          <div className="bg-border h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* File list */}
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        {files.map((uploadedFile) => (
          <div
            key={uploadedFile.id}
            onClick={() =>
              uploadedFile.status === 'completed' &&
              onFileSelect(uploadedFile.id)
            }
            className={`rounded-lg border px-3 py-2.5 transition-all ${
              uploadedFile.status === 'completed'
                ? selectedFileId === uploadedFile.id
                  ? 'cursor-pointer border-[#24a148] bg-[#defbe6]'
                  : 'cursor-pointer border-[#24a148]/20 bg-[#defbe6]/30 hover:bg-[#defbe6]/60'
                : uploadedFile.status === 'failed'
                  ? 'border-[#da1e28]/20 bg-[#fff1f1]/60'
                  : uploadedFile.status === 'converting'
                    ? 'border-primary/20 bg-accent/50'
                    : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex-shrink-0">
                <FileTypeIcon fileName={uploadedFile.file.name} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm leading-tight">
                  {uploadedFile.file.name}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {formatFileSize(uploadedFile.file.size)}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                {getStatusDisplay(uploadedFile)}
                {uploadedFile.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFile(uploadedFile.id)
                    }}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Converting progress bar */}
            {uploadedFile.status === 'converting' && (
              <div className="bg-primary/10 mt-2 h-1 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-150"
                  style={{ width: `${uploadedFile.progress}%` }}
                />
              </div>
            )}

            {/* Error message */}
            {uploadedFile.status === 'failed' && uploadedFile.error && (
              <p className="text-destructive mt-1.5 text-xs">
                {uploadedFile.error}
              </p>
            )}

            {/* Completed — click hint */}
            {uploadedFile.status === 'completed' &&
              selectedFileId !== uploadedFile.id && (
                <div className="mt-1.5 flex items-center gap-1 text-xs text-[#198038]/70">
                  <Eye className="h-3 w-3" />
                  결과 보기
                </div>
              )}
          </div>
        ))}

        {/* Add files drop zone */}
        {files.length === 0 ? (
          <div
            className={`flex h-full flex-1 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-all ${
              isDragging
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border text-muted-foreground'
            }`}
          >
            <Plus
              className={`h-6 w-6 ${isDragging ? 'text-primary' : 'text-muted-foreground/50'}`}
            />
            <p className="text-sm">
              {isDragging
                ? '여기에 놓으세요'
                : '파일을 드래그하거나 선택하세요'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-border hover:border-primary/40 hover:text-primary rounded-md border px-3 py-1.5 text-xs transition-colors"
              >
                파일 선택
              </button>
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="border-border hover:border-primary/40 hover:text-primary rounded-md border px-3 py-1.5 text-xs transition-colors"
              >
                폴더 선택
              </button>
            </div>
            <p className="text-muted-foreground/60 text-[10px]">
              HWP, HWPX, PDF, PNG, JPG, BMP, TIFF
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed py-3 text-xs transition-all ${
              isDragging
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            {isDragging ? '여기에 놓으세요' : '파일 추가 또는 드래그'}
          </button>
        )}
      </div>
    </div>
  )
}
