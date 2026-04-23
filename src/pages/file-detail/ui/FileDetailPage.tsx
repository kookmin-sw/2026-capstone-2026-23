import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  XCircle,
  Upload,
} from 'lucide-react'
import { Skeleton } from '@/shared/ui/skeleton'
import { DocumentViewer } from '@/widgets/document-viewer'
import { useDocumentOriginalFile, useDocumentResult } from '@/entities/document'
import type { DocumentStatus } from '@/shared/types'

interface FileDetailPageProps {
  fileId: string
}

export function FileDetailPage({ fileId }: FileDetailPageProps) {
  const navigate = useNavigate()
  const { data: result, isLoading } = useDocumentResult(fileId)
  const { data: originalFile, isLoading: isOriginalFileLoading } =
    useDocumentOriginalFile(fileId, result?.fileName)

  const getStatusDisplay = (status: DocumentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: CheckCircle,
          text: '변환 완료',
          color: 'text-[#198038]',
          bgColor: 'bg-[#defbe6]',
        }
      case 'PROCESSING':
        return {
          icon: Loader2,
          text: '처리 중',
          color: 'text-primary',
          bgColor: 'bg-[#edf5ff]',
        }
      case 'FAILED':
        return {
          icon: XCircle,
          text: '실패',
          color: 'text-destructive',
          bgColor: 'bg-[#fff1f1]',
        }
      case 'UPLOADED':
        return {
          icon: Upload,
          text: '업로드됨',
          color: 'text-[#684e00]',
          bgColor: 'bg-[#fddc69]/30',
        }
      default:
        return {
          icon: AlertCircle,
          text: '알 수 없음',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
        }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-border border-b px-6 py-3">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-border border-b px-6 py-3">
          <button
            onClick={() => navigate({ to: '/files' })}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">파일 관리로 돌아가기</span>
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted-foreground text-center">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p className="text-lg font-medium">문서를 찾을 수 없습니다</p>
          </div>
        </div>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(result.status)
  const StatusIcon = statusDisplay.icon

  return (
    <div className="-m-4 flex h-dvh flex-col">
      {/* Top bar */}
      <div className="border-border bg-background flex flex-shrink-0 items-center justify-between border-b px-6 py-3">
        <button
          onClick={() => navigate({ to: '/files' })}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">파일 관리</span>
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-foreground text-sm font-semibold">
            {result.fileName}
          </h2>
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${statusDisplay.bgColor}`}
          >
            <StatusIcon className={`h-3 w-3 ${statusDisplay.color}`} />
            <span className={`text-xs font-medium ${statusDisplay.color}`}>
              {statusDisplay.text}
            </span>
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {result.modelCode}
          </span>
          {result.meta?.totalPages != null && (
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {result.meta.totalPages as number}p
            </span>
          )}
          {result.meta?.processingTimeMs != null && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {((result.meta.processingTimeMs as number) / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      </div>

      {/* Fixed-height content area under the header */}
      <div className="min-h-0 flex-1 overflow-hidden p-4">
        <DocumentViewer
          documentResult={result}
          isLoading={isLoading || isOriginalFileLoading}
          originalFile={originalFile}
          className="h-full min-h-0"
        />
      </div>
    </div>
  )
}
