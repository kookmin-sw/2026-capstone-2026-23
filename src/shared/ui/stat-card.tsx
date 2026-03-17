import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  subtitle?: string
  iconColor: string
  bgColor: string
  isLoading?: boolean
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  iconColor,
  bgColor,
  isLoading,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{label}</p>
            {isLoading ? (
              <>
                <Skeleton className="mt-1 h-8 w-16" />
                <Skeleton className="mt-1 h-4 w-10" />
              </>
            ) : (
              <>
                <p className="text-foreground mt-1 text-2xl font-bold">
                  {value}
                </p>
                <p
                  className={`text-muted-foreground text-sm ${subtitle ? '' : 'invisible'}`}
                >
                  {subtitle || '-'}
                </p>
              </>
            )}
          </div>
          <div className={`${bgColor} shrink-0 p-3`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
