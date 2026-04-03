import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { Activity } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { useDashboardSummary } from '@/entities/system'

interface SuccessRateChartProps {
  mockSummary?: {
    completedJobs: number
    failedJobs: number
    processingJobs: number
    totalJobs: number
  }
  isLoading?: boolean
}

export function SuccessRateChart({
  mockSummary,
  isLoading: externalLoading,
}: SuccessRateChartProps = {}) {
  const { data: liveSummary, isLoading: liveLoading } = useDashboardSummary()
  const summary = mockSummary ?? liveSummary
  const isLoading = externalLoading ?? (mockSummary ? false : liveLoading)

  const chartData = summary
    ? [
        { name: '성공', value: summary.completedJobs, color: '#00b894' },
        { name: '실패', value: summary.failedJobs, color: '#e17055' },
        { name: '진행 중', value: summary.processingJobs, color: '#fdcb6e' },
      ].filter((d) => d.value > 0)
    : []

  const successRate =
    summary && summary.totalJobs > 0
      ? ((summary.completedJobs / summary.totalJobs) * 100).toFixed(1)
      : '0'

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00b894]/10">
            <Activity className="h-3.5 w-3.5 text-[#00b894]" />
          </div>
          <h3 className="text-foreground typo-h3">성공률 분석</h3>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-muted-foreground flex h-[250px] items-center justify-center text-sm">
            아직 처리된 작업이 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                cornerRadius={6}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: 'var(--foreground)', fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="border-border mt-4 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">성공률</span>
            <span className="font-semibold text-[#00b894]">{successRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
