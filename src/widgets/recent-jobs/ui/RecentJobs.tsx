import { Clock } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { StatusBadge } from '@/shared/ui/status-badge'
import { FileTypeBadge } from '@/shared/ui/file-type-icon'
import { Skeleton } from '@/shared/ui/skeleton'
import { useDashboardRecentItems } from '@/entities/system'

function RecentJobsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-2">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function RecentJobs() {
  const { data, isLoading } = useDashboardRecentItems(5)
  const items = data?.items ?? []

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6c5ce7]/10">
                <Clock className="h-3.5 w-3.5 text-[#6c5ce7]" />
              </div>
              <h3 className="text-foreground typo-h3">최근 작업 내역</h3>
            </div>
            <p className="text-muted-foreground mt-1 ml-9 text-xs">
              최근 처리된 파일 목록
            </p>
          </div>
        </div>
        {isLoading ? (
          <RecentJobsSkeleton />
        ) : items.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            아직 처리된 문서가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="border-border/60 border-b">
                  <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                    파일명
                  </th>
                  <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                    유형
                  </th>
                  <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                    모델
                  </th>
                  <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                    상태
                  </th>
                  <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                    날짜
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border/40 divide-y">
                {items.map((item) => (
                  <tr
                    key={item.documentId}
                    className="hover:bg-muted/40 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <span className="text-foreground font-mono text-sm font-medium">
                        {item.originalFilename}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <FileTypeBadge fileName={item.originalFilename} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-muted/60 text-muted-foreground rounded-md px-2 py-1 font-mono text-xs whitespace-nowrap">
                        {item.modelCode || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.latestStatus} />
                    </td>
                    <td className="px-4 py-3">
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
