import { X, CheckCircle, XCircle, Clock, Loader2, Eye } from 'lucide-react'
import { FileTypeIcon } from '@/shared/ui/file-type-icon'
import type { UploadFileItem } from '../model/store'

interface UploadedFilesListProps {
  files: UploadFileItem[]
  onRemoveFile: (id: string) => void
  onFileSelect: (id: string) => void
  selectedFileId?: string
  overallProgress: number
}

export function UploadedFilesList({
  files,
  onRemoveFile,
  onFileSelect,
  selectedFileId,
  overallProgress,
}: UploadedFilesListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getStatusDisplay = (file: UploadFileItem) => {
    switch (file.status) {
      case 'pending':
        return (
          <div className="text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-xs">대기 중</span>
          </div>
        )
      case 'converting':
        return (
          <div className="text-primary flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs font-medium">
              {file.currentPage && file.totalPages
                ? `Page ${file.currentPage}/${file.totalPages}`
                : '변환 중...'}
            </span>
          </div>
        )
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-[#198038]">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">완료</span>
          </div>
        )
      case 'failed':
        return (
          <div className="text-destructive flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-medium">실패</span>
          </div>
        )
    }
  }

  const completedCount = files.filter((f) => f.status === 'completed').length
  const failedCount = files.filter((f) => f.status === 'failed').length
  const convertingCount = files.filter((f) => f.status === 'converting').length

  return (
    <div className="bg-card border-border border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-semibold">
          업로드된 파일 ({files.length}개)
        </h3>
        <div className="flex items-center gap-3 text-xs">
          {convertingCount > 0 && (
            <span className="text-primary font-medium">
              변환 중: {convertingCount}
            </span>
          )}
          {completedCount > 0 && (
            <span className="font-medium text-[#198038]">
              완료: {completedCount}
            </span>
          )}
          {failedCount > 0 && (
            <span className="text-destructive font-medium">
              실패: {failedCount}
            </span>
          )}
        </div>
      </div>

      {convertingCount > 0 && (
        <div className="bg-accent border-primary/20 mb-4 border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-foreground text-sm font-medium">
              전체 진행률
            </span>
            <span className="text-foreground text-sm font-bold">
              {overallProgress}%
            </span>
          </div>
          <div className="bg-border h-2.5 w-full">
            <div
              className="bg-primary h-2.5 transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            {completedCount}/{files.length} 파일 완료
          </p>
        </div>
      )}

      <div className="max-h-[400px] space-y-2 overflow-y-auto">
        {files.map((uploadedFile) => (
          <div
            key={uploadedFile.id}
            onClick={() =>
              uploadedFile.status === 'completed' &&
              onFileSelect(uploadedFile.id)
            }
            className={`border p-3 transition-all ${
              uploadedFile.status === 'completed'
                ? selectedFileId === uploadedFile.id
                  ? 'cursor-pointer border-[#24a148] bg-[#defbe6] ring-2 ring-[#24a148]'
                  : 'cursor-pointer border-[#24a148]/30 bg-[#defbe6]/50 hover:bg-[#defbe6]'
                : uploadedFile.status === 'failed'
                  ? 'border-[#da1e28]/30 bg-[#fff1f1]'
                  : uploadedFile.status === 'converting'
                    ? 'bg-accent border-primary/30'
                    : 'bg-muted/50 border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <FileTypeIcon fileName={uploadedFile.file.name} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-foreground truncate pr-2 text-sm font-medium">
                    {uploadedFile.file.name}
                  </p>
                  {uploadedFile.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveFile(uploadedFile.id)
                      }}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    {formatFileSize(uploadedFile.file.size)}
                  </span>
                  {getStatusDisplay(uploadedFile)}
                </div>
                {uploadedFile.status === 'converting' && (
                  <div className="mt-2">
                    <div className="bg-border h-1.5 w-full">
                      <div
                        className="bg-primary h-1.5 transition-all duration-150"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {uploadedFile.progress}% 완료
                    </p>
                  </div>
                )}
                {uploadedFile.status === 'failed' && uploadedFile.error && (
                  <p className="text-destructive mt-1 text-xs">
                    오류: {uploadedFile.error}
                  </p>
                )}
                {uploadedFile.status === 'completed' &&
                  uploadedFile.resultPath && (
                    <div className="mt-1 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-[#198038]" />
                      <p className="font-mono text-xs text-[#198038]">
                        {uploadedFile.resultPath.split('/').pop()}
                      </p>
                    </div>
                  )}
                {uploadedFile.status === 'completed' &&
                  selectedFileId !== uploadedFile.id && (
                    <div className="mt-1 flex items-center gap-1">
                      <Eye className="h-3 w-3 text-[#198038]" />
                      <p className="text-xs font-medium text-[#198038]">
                        클릭하여 결과 보기
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
