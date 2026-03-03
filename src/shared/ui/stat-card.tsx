import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  subtitle?: string
  iconColor: string
  bgColor: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  iconColor,
  bgColor,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{label}</p>
            <p className="text-foreground mt-1 text-2xl font-bold">{value}</p>
            <p
              className={`text-muted-foreground text-sm ${subtitle ? '' : 'invisible'}`}
            >
              {subtitle || '-'}
            </p>
          </div>
          <div className={`${bgColor} shrink-0 p-3`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
