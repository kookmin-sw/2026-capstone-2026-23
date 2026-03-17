import { Card, CardContent } from '@/shared/ui/card'
import { StatusBadge } from '@/shared/ui/status-badge'
import { FileTypeBadge } from '@/shared/ui/file-type-icon'
import { useDashboardRecentItems } from '@/entities/system'
import { Loader2 } from 'lucide-react'

export function RecentJobs() {
  const { data, isLoading } = useDashboardRecentItems(5)
  const items = data?.items ?? []

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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            아직 처리된 문서가 없습니다.
          </div>
        ) : (
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
                {items.map((item) => (
                  <tr
                    key={item.documentId}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-2">
                      <span className="text-foreground font-mono text-sm font-medium">
                        {item.originalFilename}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <FileTypeBadge fileName={item.originalFilename} />
                    </td>
                    <td className="px-4 py-2">
                      <span className="bg-muted text-muted-foreground px-2 py-1 font-mono text-xs whitespace-nowrap">
                        {item.modelCode || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={item.latestStatus} />
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-muted-foreground text-sm">
                        {new Date(item.uploadedAt).toLocaleString('ko-KR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
