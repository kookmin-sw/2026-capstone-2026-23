import { X, CheckCircle, XCircle, Clock, Loader2, Eye } from 'lucide-react'
import { FileTypeIcon } from '@/shared/ui/file-type-icon'
import type { UploadedFile } from '../model/store'

interface UploadedFilesListProps {
  files: UploadedFile[]
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

  const getStatusDisplay = (file: UploadedFile) => {
    switch (file.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs">대기 중</span>
          </div>
        )
      case 'converting':
        return (
          <div className="flex items-center gap-2 text-primary">
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
          <div className="flex items-center gap-2 text-destructive">
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
    <div className="bg-card border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          업로드된 파일 ({files.length}개)
        </h3>
        <div className="flex items-center gap-3 text-xs">
          {convertingCount > 0 && (
            <span className="text-primary font-medium">
              변환 중: {convertingCount}
            </span>
          )}
          {completedCount > 0 && (
            <span className="text-[#198038] font-medium">
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
        <div className="mb-4 p-3 bg-accent border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              전체 진행률
            </span>
            <span className="text-sm font-bold text-foreground">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-border h-2.5">
            <div
              className="bg-primary h-2.5 transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completedCount}/{files.length} 파일 완료
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {files.map((uploadedFile) => (
          <div
            key={uploadedFile.id}
            onClick={() =>
              uploadedFile.status === 'completed' &&
              onFileSelect(uploadedFile.id)
            }
            className={`p-3 border transition-all ${
              uploadedFile.status === 'completed'
                ? selectedFileId === uploadedFile.id
                  ? 'bg-[#defbe6] border-[#24a148] ring-2 ring-[#24a148] cursor-pointer'
                  : 'bg-[#defbe6]/50 border-[#24a148]/30 cursor-pointer hover:bg-[#defbe6]'
                : uploadedFile.status === 'failed'
                  ? 'bg-[#fff1f1] border-[#da1e28]/30'
                  : uploadedFile.status === 'converting'
                    ? 'bg-accent border-primary/30'
                    : 'bg-muted/50 border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <FileTypeIcon fileName={uploadedFile.file.name} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate pr-2">
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.file.size)}
                  </span>
                  {getStatusDisplay(uploadedFile)}
                </div>
                {uploadedFile.status === 'converting' && (
                  <div className="mt-2">
                    <div className="w-full bg-border h-1.5">
                      <div
                        className="bg-primary h-1.5 transition-all duration-150"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadedFile.progress}% 완료
                    </p>
                  </div>
                )}
                {uploadedFile.status === 'failed' && uploadedFile.error && (
                  <p className="text-xs text-destructive mt-1">
                    오류: {uploadedFile.error}
                  </p>
                )}
                {uploadedFile.status === 'completed' &&
                  uploadedFile.resultPath && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="h-3 w-3 text-[#198038]" />
                      <p className="text-xs text-[#198038] font-mono">
                        {uploadedFile.resultPath.split('/').pop()}
                      </p>
                    </div>
                  )}
                {uploadedFile.status === 'completed' &&
                  selectedFileId !== uploadedFile.id && (
                    <div className="flex items-center gap-1 mt-1">
                      <Eye className="h-3 w-3 text-[#198038]" />
                      <p className="text-xs text-[#198038] font-medium">
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
