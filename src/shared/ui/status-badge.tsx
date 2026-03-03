import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import type { FileStatus } from '@/shared/types'

interface StatusBadgeProps {
  status: FileStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 bg-[#defbe6] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#198038]">
          <CheckCircle className="h-3.5 w-3.5" />
          완료
        </span>
      )
    case 'converting':
      return (
        <span className="inline-flex items-center gap-1 bg-[#edf5ff] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#0f62fe]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          변환 중
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 bg-[#fff1f1] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#da1e28]">
          <XCircle className="h-3.5 w-3.5" />
          실패
        </span>
      )
    case 'queued':
      return (
        <span className="inline-flex items-center gap-1 bg-[#e0e0e0] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#525252]">
          <Clock className="h-3.5 w-3.5" />
          대기 중
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 bg-[#fddc69] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#684e00]">
          <Clock className="h-3.5 w-3.5" />
          대기
        </span>
      )
    default:
      return null
  }
}
