import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import { StatCard } from '@/shared/ui/stat-card'
import type { DashboardSummary } from '@/shared/types'

interface DashboardStatsProps {
  stats: DashboardSummary
  isLoading?: boolean
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
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
        iconColor="text-[#6c5ce7]"
        bgColor="bg-[#6c5ce7]/10"
        accentColor="#6c5ce7"
        isLoading={isLoading}
      />
      <StatCard
        icon={CheckCircle}
        label="완료"
        value={stats.completedJobs}
        subtitle={`${completionRate}%`}
        iconColor="text-[#00b894]"
        bgColor="bg-[#00b894]/10"
        accentColor="#00b894"
        isLoading={isLoading}
      />
      <StatCard
        icon={Clock}
        label="진행 중"
        value={stats.processingJobs}
        iconColor="text-[#fdcb6e]"
        bgColor="bg-[#f9a825]/10"
        accentColor="#fdcb6e"
        isLoading={isLoading}
      />
      <StatCard
        icon={XCircle}
        label="실패"
        value={stats.failedJobs}
        subtitle={`${failureRate}%`}
        iconColor="text-[#e17055]"
        bgColor="bg-[#e17055]/10"
        accentColor="#e17055"
        isLoading={isLoading}
      />
    </div>
  )
}
