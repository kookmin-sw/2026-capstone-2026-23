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
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-foreground text-lg font-semibold">
              최근 작업 내역
            </h3>
            <p className="text-muted-foreground text-xs">
              최근 처리된 파일 목록
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
                  파일명
                </th>
                <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
                  유형
                </th>
                <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
                  페이지
                </th>
                <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
                  처리 시간
                </th>
                <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
                  모델
                </th>
                <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
                  상태
                </th>
                <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-2">
                    <span className="text-foreground font-mono text-sm font-medium">
                      {job.fileName}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <FileTypeBadge fileName={job.fileName} />
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-muted-foreground text-sm">
                      {job.pages}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-muted-foreground text-sm">
                      {job.duration}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="bg-muted text-muted-foreground px-2 py-1 font-mono text-xs whitespace-nowrap">
                      {job.model}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-muted-foreground text-sm">
                      {job.date}
                    </span>
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
