import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { useDocuments } from '@/entities/document'

interface TrendChartProps {
  mockData?: { items: { uploadedAt: string }[] }
  isLoading?: boolean
}

export function TrendChart({
  mockData,
  isLoading: externalLoading,
}: TrendChartProps = {}) {
  const { data: liveData, isLoading: liveLoading } = useDocuments()
  const data = mockData ?? liveData
  const isLoading = externalLoading ?? (mockData ? false : liveLoading)

  const chartData = useMemo(() => {
    if (!data?.items?.length) return []

    // 최근 7일 날짜 생성
    const days: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`
      days[key] = 0
    }

    // 문서 uploadedAt 기준으로 날짜별 카운트
    data.items.forEach((doc) => {
      const d = new Date(doc.uploadedAt)
      const key = `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`
      if (key in days) {
        days[key]++
      }
    })

    return Object.entries(days).map(([date, count]) => ({ date, count }))
  }, [data])

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff7121]/10">
                <TrendingUp className="h-3.5 w-3.5 text-[#ff7121]" />
              </div>
              <h3 className="text-foreground typo-h3">일별 처리량</h3>
            </div>
            <p className="text-muted-foreground mt-1 ml-9 text-xs">
              최근 7일간 처리된 파일 수
            </p>
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-[250px] w-full rounded-lg" />
        ) : chartData.length === 0 ? (
          <div className="text-muted-foreground flex h-[250px] items-center justify-center text-sm">
            아직 처리된 문서가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 5, left: -35, bottom: 0 }}
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7121" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ff7121" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                stroke="var(--border)"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                stroke="var(--border)"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
                formatter={(value: number) => [`${value}건`, '처리량']}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#ff7121"
                strokeWidth={2.5}
                fill="url(#trendGradient)"
                dot={{ fill: '#ff7121', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: '#fff',
                  fill: '#ff7121',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
