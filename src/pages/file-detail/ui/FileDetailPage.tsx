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
import { useDocumentResult } from '@/entities/document'
import type { DocumentStatus } from '@/shared/types'

interface FileDetailPageProps {
  fileId: string
}

export function FileDetailPage({ fileId }: FileDetailPageProps) {
  const navigate = useNavigate()
  const { data: result, isLoading } = useDocumentResult(fileId)

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
      <div className="bg-card min-h-full">
        <div className="border-border border-b px-8 py-4">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="mx-auto max-w-5xl px-8 py-12">
          <Skeleton className="mb-4 h-7 w-24" />
          <Skeleton className="mb-6 h-10 w-80" />
          <div className="mb-8 flex gap-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-9 w-44" />
          <div className="border-border mt-8 border-t pt-8">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="bg-card min-h-full">
        <div className="border-border border-b px-8 py-4">
          <button
            onClick={() => navigate({ to: '/files' })}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">파일 관리로 돌아가기</span>
          </button>
        </div>
        <div className="flex min-h-[400px] items-center justify-center">
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
    <div className="bg-card min-h-full">
      <div className="border-border border-b px-8 py-4">
        <button
          onClick={() => navigate({ to: '/files' })}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">파일 관리로 돌아가기</span>
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-8 py-12">
        <div className="mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 ${statusDisplay.bgColor}`}
          >
            <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
            <span className={`text-sm font-medium ${statusDisplay.color}`}>
              {statusDisplay.text}
            </span>
          </div>
        </div>

        <h2 className="text-foreground mb-6 text-4xl font-bold">
          {result.fileName}
        </h2>

        <div className="text-muted-foreground mb-8 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>모델: {result.modelCode}</span>
          </div>
          {result.meta?.totalPages != null && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{result.meta.totalPages as number} 페이지</span>
            </div>
          )}
          {result.meta?.processingTimeMs != null && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                처리 시간:{' '}
                {((result.meta.processingTimeMs as number) / 1000).toFixed(1)}초
              </span>
            </div>
          )}
        </div>

        <div className="border-border border-t pt-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="border-border bg-muted/30 min-h-[600px] border p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">
                  원본 문서
                </h3>
                <span className="text-muted-foreground bg-card border-border border px-2 py-1 text-xs">
                  {result.fileName}
                </span>
              </div>
              <div className="bg-card border-border flex h-[520px] items-center justify-center border">
                <div className="text-muted-foreground text-center">
                  <FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p className="text-sm font-medium">원본 파일 뷰어</p>
                  <p className="mt-1 text-xs">한컴 뷰어 등 필요</p>
                </div>
              </div>
            </div>
            <div className="border-border bg-accent/30 min-h-150 border p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">
                  변환된 문서
                </h3>
                <span className="text-primary bg-accent border-primary/20 border px-2 py-1 text-xs font-medium">
                  구조화된 데이터
                </span>
              </div>
              <div className="bg-card border-border h-130 overflow-auto border p-4">
                {result.txt?.preview ? (
                  <pre className="text-sm whitespace-pre-wrap">
                    {result.txt.preview}
                  </pre>
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-center">
                    <div>
                      <FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
                      <p className="text-sm font-medium">변환 결과 없음</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
