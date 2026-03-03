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

export function SuccessRateChart() {
  const data = [
    { name: '성공', value: 142, color: '#24a148' },
    { name: '실패', value: 11, color: '#da1e28' },
    { name: '부분성공', value: 3, color: '#f1c21b' },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Activity className="text-primary h-4 w-4" />
          <h3 className="text-foreground text-lg font-semibold">성공률 분석</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
        <div className="border-border mt-4 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">평균 처리 시간</span>
            <span className="text-foreground font-semibold">2분 45초</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
