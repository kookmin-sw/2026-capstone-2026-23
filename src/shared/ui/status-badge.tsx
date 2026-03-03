import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import type { FileStatus } from '@/shared/types'

interface StatusBadgeProps {
  status: FileStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 whitespace-nowrap bg-[#defbe6] text-[#198038] text-xs font-medium">
          <CheckCircle className="h-3.5 w-3.5" />
          완료
        </span>
      )
    case 'converting':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 whitespace-nowrap bg-[#edf5ff] text-[#0f62fe] text-xs font-medium">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          변환 중
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 whitespace-nowrap bg-[#fff1f1] text-[#da1e28] text-xs font-medium">
          <XCircle className="h-3.5 w-3.5" />
          실패
        </span>
      )
    case 'queued':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 whitespace-nowrap bg-[#e0e0e0] text-[#525252] text-xs font-medium">
          <Clock className="h-3.5 w-3.5" />
          대기 중
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 whitespace-nowrap bg-[#fddc69] text-[#684e00] text-xs font-medium">
          <Clock className="h-3.5 w-3.5" />
          대기
        </span>
      )
    default:
      return null
  }
}
