import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import { StatCard } from '@/shared/ui/stat-card'
import type { DashboardStats as DashboardStatsType } from '@/shared/types'

interface DashboardStatsProps {
  stats: DashboardStatsType
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const completionRate =
    stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0'
  const failureRate =
    stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(1) : '0'

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        icon={FileText}
        label="전체 작업"
        value={stats.total}
        iconColor="text-primary"
        bgColor="bg-[#edf5ff]"
      />
      <StatCard
        icon={CheckCircle}
        label="완료"
        value={stats.completed}
        subtitle={`${completionRate}%`}
        iconColor="text-[#198038]"
        bgColor="bg-[#defbe6]"
      />
      <StatCard
        icon={Clock}
        label="진행 중"
        value={stats.inProgress}
        iconColor="text-[#684e00]"
        bgColor="bg-[#fddc69]/30"
      />
      <StatCard
        icon={XCircle}
        label="실패"
        value={stats.failed}
        subtitle={`${failureRate}%`}
        iconColor="text-destructive"
        bgColor="bg-[#fff1f1]"
      />
    </div>
  )
}
