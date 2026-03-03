import { Card, CardContent } from '@/shared/ui/card'
import { StatusBadge } from '@/shared/ui/status-badge'
import { FileTypeBadge } from '@/shared/ui/file-type-icon'
import type { FileStatus } from '@/shared/types'

interface Job {
  id: string
  fileName: string
  status: FileStatus
  date: string
  pages: number
  duration: string
  model: string
}

export function RecentJobs() {
  const jobs: Job[] = [
    {
      id: '1',
      fileName: 'report_2024_Q4.hwp',
      status: 'completed',
      date: '2024-12-09 14:32',
      pages: 45,
      duration: '2m 15s',
      model: 'gpt-5.2',
    },
    {
      id: '2',
      fileName: 'technical_spec.pdf',
      status: 'completed',
      date: '2024-12-09 14:15',
      pages: 128,
      duration: '5m 42s',
      model: 'gpt-5.2',
    },
    {
      id: '3',
      fileName: 'chart_analysis.png',
      status: 'completed',
      date: '2024-12-09 13:58',
      pages: 1,
      duration: '0m 8s',
      model: 'deepseek-ocr-2',
    },
    {
      id: '4',
      fileName: 'financial_data.hwp',
      status: 'failed',
      date: '2024-12-09 13:42',
      pages: 32,
      duration: '1m 23s',
      model: 'gpt-5.2',
    },
    {
      id: '5',
      fileName: 'contract_draft.pdf',
      status: 'converting',
      date: '2024-12-09 13:25',
      pages: 18,
      duration: '-',
      model: 'gpt-5.2',
    },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">최근 작업 내역</h3>
            <p className="text-sm text-muted-foreground mt-1">최근 처리된 파일 목록</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  파일명
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  유형
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  페이지
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  처리 시간
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  모델
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground font-mono">
                      {job.fileName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <FileTypeBadge fileName={job.fileName} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{job.pages}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{job.duration}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 whitespace-nowrap bg-muted text-muted-foreground font-mono">
                      {job.model}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{job.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
