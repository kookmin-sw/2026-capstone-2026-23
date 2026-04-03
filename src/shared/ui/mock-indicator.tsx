import { useUIStore } from '@/app/model/ui-store'

interface MockIndicatorProps {
  label?: string
  children: React.ReactNode
}

export function MockIndicator({ label, children }: MockIndicatorProps) {
  const { isMockMode } = useUIStore()

  if (!import.meta.env.DEV || !isMockMode) return <>{children}</>

  return (
    <div className="relative">
      <div className="border-destructive/30 pointer-events-none absolute inset-0 z-10 border-2 border-dashed" />
      <div className="bg-destructive text-destructive-foreground absolute top-0 right-0 z-10 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
        MOCK{label ? ` · ${label}` : ''}
      </div>
      {children}
    </div>
  )
}
