import { XCircle } from 'lucide-react'

interface ErrorTypeBadgeProps {
  type: string
}

const typeColors: Record<string, string> = {
  'VLM 타임아웃': 'bg-[#fff1f1] text-[#da1e28]',
  '메모리 부족': 'bg-[#fff2e8] text-[#ba4e00]',
  '변환 실패': 'bg-[#fddc69]/30 text-[#684e00]',
  '파일 형식 오류': 'bg-[#e8daff] text-[#6929c4]',
}

export function ErrorTypeBadge({ type }: ErrorTypeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 whitespace-nowrap ${typeColors[type] || 'bg-muted text-muted-foreground'} text-xs font-medium`}
    >
      <XCircle className="h-3 w-3" />
      {type}
    </span>
  )
}
