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
  OctagonX,
  Square,
} from 'lucide-react'
import { Skeleton } from '@/shared/ui/skeleton'
import { DocumentViewer } from '@/widgets/document-viewer'
import {
  useDocuments,
  useDocumentOriginalPreviewFile,
  useDocumentResult,
} from '@/entities/document'
import { useCancelJob } from '@/entities/parser'
import { getDocumentOriginalDownloadUrl } from '@/shared/api'
import type { DocumentStatus } from '@/shared/types'

interface FileDetailPageProps {
  fileId: string
}

export function FileDetailPage({ fileId }: FileDetailPageProps) {
  const navigate = useNavigate()
  const {
    data: result,
    isLoading,
    refetch: refetchDocumentResult,
  } = useDocumentResult(fileId)
  const { data: documentsData } = useDocuments(10000)
  const { data: originalFile, isLoading: isOriginalFileLoading } =
    useDocumentOriginalPreviewFile(fileId, result?.fileName)
  const cancelMutation = useCancelJob()

  const documentItem = documentsData?.items.find(
    (item) => item.documentId === fileId,
  )
  const currentStatus = documentItem?.latestStatus ?? result?.status
  const activeStatuses = new Set<DocumentStatus>([
    'UPLOADED',
    'QUEUED',
    'PROCESSING',
    'PREPROCESSING',
    'GPU_WAITING',
    'GPU_PROCESSING',
    'POSTPROCESSING',
  ])
  const jobId = documentItem?.jobId ?? result?.jobId ?? null
  const canCancelJob =
    !!jobId && !!currentStatus && activeStatuses.has(currentStatus)

  const handleCancelJob = async (force = false) => {
    if (!jobId) return
    await cancelMutation.mutateAsync({ jobId, force })
    await refetchDocumentResult()
  }

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
      case 'PREPROCESSING':
      case 'GPU_WAITING':
      case 'GPU_PROCESSING':
      case 'POSTPROCESSING':
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
      case 'QUEUED':
        return {
          icon: Upload,
          text: '업로드됨',
          color: 'text-[#684e00]',
          bgColor: 'bg-[#fddc69]/30',
        }
      case 'CANCELED':
        return {
          icon: XCircle,
          text: '취소',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
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
      <div className="flex h-[calc(100dvh-2.5rem)] flex-col">
        <div className="border-border flex items-center justify-between border-b px-6 py-3">
          <button
            onClick={() => navigate({ to: '/files' })}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">파일 관리</span>
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-muted-foreground text-sm font-semibold">
              문서를 찾을 수 없습니다
            </h2>
          </div>
          <div className="w-[120px]" />
        </div>
        <div className="flex-1 overflow-hidden p-4">
          <DocumentViewer
            className="h-full"
            emptyTitle="문서를 찾을 수 없습니다"
            emptyDescription="삭제되었거나 접근할 수 없는 문서입니다."
          />
        </div>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(currentStatus ?? result.status)
  const StatusIcon = statusDisplay.icon

  return (
    <div className="-m-4 flex h-dvh min-w-0 flex-col">
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

        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          {canCancelJob && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => void handleCancelJob(false)}
                disabled={cancelMutation.isPending}
                className="border-border hover:bg-muted text-muted-foreground flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
              >
                <Square className="h-3.5 w-3.5" />
                중지
              </button>
              <button
                onClick={() => void handleCancelJob(true)}
                disabled={cancelMutation.isPending}
                className="border-destructive/45 text-destructive hover:bg-destructive/10 flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50"
              >
                <OctagonX className="h-3.5 w-3.5" />
                강제 취소
              </button>
            </div>
          )}
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
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden p-4">
        <DocumentViewer
          documentResult={result}
          isLoading={isLoading || isOriginalFileLoading}
          originalFile={originalFile}
          originalDownloadUrl={getDocumentOriginalDownloadUrl(fileId)}
          className="h-full min-h-0"
        />
      </div>
    </div>
  )
}
