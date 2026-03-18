import { useRef } from 'react'
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Eye,
  Plus,
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
}

export function UploadedFilesList({
  files,
  onRemoveFile,
  onFileSelect,
  onFilesAdded,
  selectedFileId,
  overallProgress,
}: UploadedFilesListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
    <div className="flex h-full flex-col">
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
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          추가
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".hwp,.hwpx,.pdf,.png,.jpg,.jpeg,.bmp,.tiff"
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
      </div>
    </div>
  )
}
