import { useState } from 'react'
import { AlertTriangle, Inbox } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { ErrorTypeBadge } from '@/shared/ui/error-type-badge'
import { ErrorDetailModal } from '@/shared/ui/error-detail-modal'
import { useUIStore } from '@/app/model/ui-store'
import { useErrorSummary } from '@/entities/error-log'
import type { ErrorDetail } from '@/shared/types'

interface ErrorLogWidgetProps {
  onViewAll: () => void
}

const MOCK_ERRORS: ErrorDetail[] = [
  {
    id: '1',
    message: 'VLM 타임아웃: 응답 시간 초과 (30초)',
    fileName: 'large_document.pdf',
    timestamp: '2024-12-09 14:05',
    type: 'VLM 타임아웃',
    filePath: 'data/inputs/large_document.pdf',
    pageNumber: 15,
  },
  {
    id: '2',
    message: '메모리 부족: 페이지 처리 중 메모리 할당 실패',
    fileName: 'high_res_scan.tiff',
    timestamp: '2024-12-09 13:42',
    type: '메모리 부족',
    filePath: 'data/inputs/high_res_scan.tiff',
    pageNumber: 1,
  },
  {
    id: '3',
    message: '변환 실패: HWP 파일 형식 오류',
    fileName: 'corrupted_file.hwp',
    timestamp: '2024-12-09 12:18',
    type: '변환 실패',
    filePath: 'data/inputs/corrupted_file.hwp',
  },
]

const MOCK_ERROR_STATS = [
  { type: 'VLM 타임아웃', count: 5, color: '#e17055' },
  { type: '메모리 부족', count: 3, color: '#fdcb6e' },
  { type: '변환 실패', count: 2, color: '#ff7121' },
  { type: '파일 형식 오류', count: 1, color: '#0984e3' },
]

const ERROR_STAT_COLORS = ['#e17055', '#fdcb6e', '#ff7121', '#0984e3']

export function ErrorLogWidget({ onViewAll }: ErrorLogWidgetProps) {
  const { isMockMode } = useUIStore()
  const [selectedError, setSelectedError] = useState<ErrorDetail | null>(null)
  const errorSummary = useErrorSummary(!isMockMode)

  const errors = isMockMode ? MOCK_ERRORS : (errorSummary.data?.recent ?? [])
  const errorStats = isMockMode
    ? MOCK_ERROR_STATS
    : Object.entries(errorSummary.data?.byType ?? {}).map(
        ([type, count], index) => ({
          type,
          count,
          color: ERROR_STAT_COLORS[index % ERROR_STAT_COLORS.length],
        }),
      )
  const totalErrors = isMockMode
    ? MOCK_ERROR_STATS.reduce((sum, stat) => sum + stat.count, 0)
    : (errorSummary.data?.totalErrors ?? 0)

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e17055]/10">
            <AlertTriangle className="h-3.5 w-3.5 text-[#e17055]" />
          </div>
          <h3 className="text-foreground typo-h3">에러 로그 모니터링</h3>
        </div>

        {errorSummary.isLoading && !isMockMode ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Inbox className="text-muted-foreground/40 mb-2 h-10 w-10" />
            <p className="text-muted-foreground text-sm">
              에러 로그를 불러오는 중입니다
            </p>
          </div>
        ) : errors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Inbox className="text-muted-foreground/40 mb-2 h-10 w-10" />
            <p className="text-muted-foreground text-sm">에러가 없습니다</p>
          </div>
        ) : (
          <>
            {/* Error Type Statistics */}
            <div className="bg-muted/30 mb-5 rounded-xl p-4">
              <h4 className="text-foreground mb-3 text-sm font-medium">
                에러 유형별 통계
              </h4>
              <div className="space-y-3">
                {errorStats.map((stat, index) => (
                  <div key={index}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {stat.type}
                      </span>
                      <span className="text-foreground text-sm font-semibold">
                        {stat.count}건
                      </span>
                    </div>
                    <div className="bg-muted/50 h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${totalErrors > 0 ? (stat.count / totalErrors) * 100 : 0}%`,
                          backgroundColor: stat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Errors Table */}
            <div>
              <h4 className="text-foreground mb-3 text-sm font-medium">
                최근 발생한 에러 내역 상위 5개
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead>
                    <tr className="border-border/60 border-b">
                      <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                        에러 유형
                      </th>
                      <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                        에러 메시지
                      </th>
                      <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                        파일명
                      </th>
                      <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                        페이지
                      </th>
                      <th className="text-muted-foreground typo-overline px-4 py-2.5 text-left">
                        발생 시각
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/40 divide-y">
                    {errors.map((error) => (
                      <tr
                        key={error.id}
                        onClick={() => setSelectedError(error)}
                        className="hover:bg-muted/40 cursor-pointer transition-colors duration-150"
                      >
                        <td className="px-4 py-3">
                          <ErrorTypeBadge type={error.type} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-foreground text-sm">
                            {error.message}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-foreground font-mono text-sm font-medium">
                            {error.fileName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground text-sm">
                            {error.pageNumber || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground text-sm">
                            {error.timestamp}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={onViewAll}
                className="text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150"
              >
                전체 에러 로그 보기 →
              </button>
            </div>

            <ErrorDetailModal
              error={selectedError}
              onClose={() => setSelectedError(null)}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
