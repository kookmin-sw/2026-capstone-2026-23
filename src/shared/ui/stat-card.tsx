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
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            <p className={`text-sm text-muted-foreground ${subtitle ? '' : 'invisible'}`}>{subtitle || '-'}</p>
          </div>
          <div className={`${bgColor} p-3 shrink-0`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
