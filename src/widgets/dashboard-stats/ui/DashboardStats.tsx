import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import { StatCard } from '@/shared/ui/stat-card'
import type { DashboardSummary } from '@/shared/types'

interface DashboardStatsProps {
  stats: DashboardSummary
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const completionRate =
    stats.totalJobs > 0
      ? ((stats.completedJobs / stats.totalJobs) * 100).toFixed(1)
      : '0'
  const failureRate =
    stats.totalJobs > 0
      ? ((stats.failedJobs / stats.totalJobs) * 100).toFixed(1)
      : '0'

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        icon={FileText}
        label="전체 작업"
        value={stats.totalJobs}
        iconColor="text-primary"
        bgColor="bg-[#edf5ff]"
      />
      <StatCard
        icon={CheckCircle}
        label="완료"
        value={stats.completedJobs}
        subtitle={`${completionRate}%`}
        iconColor="text-[#198038]"
        bgColor="bg-[#defbe6]"
      />
      <StatCard
        icon={Clock}
        label="진행 중"
        value={stats.processingJobs}
        iconColor="text-[#684e00]"
        bgColor="bg-[#fddc69]/30"
      />
      <StatCard
        icon={XCircle}
        label="실패"
        value={stats.failedJobs}
        subtitle={`${failureRate}%`}
        iconColor="text-destructive"
        bgColor="bg-[#fff1f1]"
      />
    </div>
  )
}
