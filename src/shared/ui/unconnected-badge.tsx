import { Unplug } from 'lucide-react'

interface UnconnectedBadgeProps {
  children: React.ReactNode
  label?: string
}

/**
 * API 미연결 버튼에 표시하는 뱃지.
 * DEV 환경에서만 표시됩니다.
 */
export function UnconnectedBadge({ children, label }: UnconnectedBadgeProps) {
  if (!import.meta.env.DEV) return <>{children}</>

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
