import { CheckCircle, XCircle, Loader2, Clock, Upload, Ban } from 'lucide-react'
import type { DocumentStatus } from '@/shared/types'

interface StatusBadgeProps {
  status: DocumentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 bg-[#defbe6] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#198038]">
          <CheckCircle className="h-3.5 w-3.5" />
          완료
        </span>
      )
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1 bg-[#edf5ff] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#0f62fe]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          변환 중
        </span>
      )
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1 bg-[#fff1f1] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#da1e28]">
          <XCircle className="h-3.5 w-3.5" />
          실패
        </span>
      )
    case 'UPLOADED':
      return (
        <span className="inline-flex items-center gap-1 bg-[#fddc69] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#684e00]">
          <Upload className="h-3.5 w-3.5" />
          업로드됨
        </span>
      )
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 bg-[#e0e0e0] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#525252]">
          <Ban className="h-3.5 w-3.5" />
          취소됨
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 bg-[#e0e0e0] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#525252]">
          <Clock className="h-3.5 w-3.5" />알 수 없음
        </span>
      )
  }
}
