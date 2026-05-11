import { CheckCircle, XCircle, Loader2, Clock, Upload, Ban } from 'lucide-react'
import type { DocumentStatus } from '@/shared/types'

interface StatusBadgeProps {
  status: DocumentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#defbe6] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-[#198038]">
          <CheckCircle className="h-3 w-3" />
          완료
        </span>
      )
    case 'PROCESSING':
    case 'PREPROCESSING':
    case 'GPU_WAITING':
    case 'GPU_PROCESSING':
    case 'POSTPROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5ff] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-[#0f62fe]">
          <Loader2 className="h-3 w-3 animate-spin" />
          변환 중
        </span>
      )
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-[#da1e28]">
          <XCircle className="h-3 w-3" />
          실패
        </span>
      )
    case 'UPLOADED':
    case 'QUEUED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f4f4] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-[#525252]">
          <Upload className="h-3 w-3" />
          대기
        </span>
      )
    case 'CANCELED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f4f4] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-[#525252]">
          <Ban className="h-3 w-3" />
          취소
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f4f4] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-[#525252]">
          <Clock className="h-3 w-3" />알 수 없음
        </span>
      )
  }
}
