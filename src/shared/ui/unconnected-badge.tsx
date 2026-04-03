import { Unplug } from 'lucide-react'
import { useUIStore } from '@/app/model/ui-store'

interface UnconnectedBadgeProps {
  children: React.ReactNode
  label?: string
}

/**
 * API 미연결 버튼에 표시하는 뱃지.
 * DEV 환경 + 목업 모드일 때만 표시됩니다.
 */
export function UnconnectedBadge({ children, label }: UnconnectedBadgeProps) {
  const { isMockMode } = useUIStore()

  if (!import.meta.env.DEV || !isMockMode) return <>{children}</>

  return (
    <div className="group/unconnected relative inline-flex">
      {children}
      <span className="absolute -top-1.5 -right-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 shadow-sm">
        <Unplug className="h-2.5 w-2.5 text-amber-900" />
      </span>
      <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-[10px] font-medium whitespace-nowrap text-white opacity-0 transition-opacity group-hover/unconnected:opacity-100">
        API 미연결{label ? ` · ${label}` : ''}
      </span>
    </div>
  )
}
