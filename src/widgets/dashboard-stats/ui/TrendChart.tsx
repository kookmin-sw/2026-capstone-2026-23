import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

export function TrendChart() {
  const data = [
    { date: '12/03', count: 18 },
    { date: '12/04', count: 22 },
    { date: '12/05', count: 15 },
    { date: '12/06', count: 28 },
    { date: '12/07', count: 24 },
    { date: '12/08', count: 31 },
    { date: '12/09', count: 18 },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary h-4 w-4" />
              <h3 className="text-foreground text-lg font-semibold">
                일별 처리량
              </h3>
            </div>
            <p className="text-muted-foreground text-xs">
              최근 7일간 처리된 파일 수
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#525252" />
            <YAxis tick={{ fontSize: 12 }} stroke="#525252" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '0px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0f62fe"
              strokeWidth={2}
              dot={{ fill: '#0f62fe', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
