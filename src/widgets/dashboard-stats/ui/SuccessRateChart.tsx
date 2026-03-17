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

export function SuccessRateChart() {
  const { data: summary, isLoading } = useDashboardSummary()

  const chartData = summary
    ? [
        { name: '성공', value: summary.completedJobs, color: '#24a148' },
        { name: '실패', value: summary.failedJobs, color: '#da1e28' },
        { name: '진행 중', value: summary.processingJobs, color: '#f1c21b' },
      ].filter((d) => d.value > 0)
    : []

  const successRate =
    summary && summary.totalJobs > 0
      ? ((summary.completedJobs / summary.totalJobs) * 100).toFixed(1)
      : '0'

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Activity className="text-primary h-4 w-4" />
          <h3 className="text-foreground text-lg font-semibold">성공률 분석</h3>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Skeleton className="h-[250px] w-full" />
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
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '0px',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="border-border mt-4 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">성공률</span>
            <span className="text-foreground font-semibold">
              {successRate}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
