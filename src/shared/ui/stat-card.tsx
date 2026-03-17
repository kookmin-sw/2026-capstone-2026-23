import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  unit?: string
  subtitle?: string
  iconColor: string
  bgColor: string
  accentColor?: string
  isLoading?: boolean
}

export function StatCard({
  icon: Icon,
  label,
  value,
  unit = '건',
  subtitle,
  iconColor,
  bgColor,
  accentColor,
  isLoading,
}: StatCardProps) {
  return (
    <Card className={`relative overflow-hidden ${accentColor ? '' : ''}`}>
      {accentColor && (
        <div
          className="absolute top-0 left-0 h-1 w-full rounded-t-xl"
          style={{ background: accentColor }}
        />
      )}
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground typo-caption font-medium tracking-wide uppercase">
              {label}
            </p>
            {isLoading ? (
              <>
                <Skeleton className="mt-2 h-8 w-16" />
                <Skeleton className="mt-1 h-4 w-10" />
              </>
            ) : (
              <>
                <p className="text-foreground typo-stat mt-1">
                  {(value ?? 0).toLocaleString()}
                  <span className="text-muted-foreground ml-0.5 text-sm font-normal">
                    {unit}
                  </span>
                </p>
                <p
                  className={`text-muted-foreground mt-0.5 text-sm ${subtitle ? '' : 'invisible'}`}
                >
                  {subtitle || '-'}
                </p>
              </>
            )}
          </div>
          <div className={`${bgColor} shrink-0 rounded-xl p-3`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
