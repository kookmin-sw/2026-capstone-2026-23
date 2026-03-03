import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { ErrorTypeBadge } from '@/shared/ui/error-type-badge'
import { ErrorDetailModal } from '@/shared/ui/error-detail-modal'
import type { ErrorDetail } from '@/shared/types'

interface ErrorLogWidgetProps {
  onViewAll: () => void
}

export function ErrorLogWidget({ onViewAll }: ErrorLogWidgetProps) {
  const [selectedError, setSelectedError] = useState<ErrorDetail | null>(null)

  const errors: ErrorDetail[] = [
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

  const errorStats = [
    { type: 'VLM 타임아웃', count: 5, color: 'bg-destructive' },
    { type: '메모리 부족', count: 3, color: 'bg-[#ff832b]' },
    { type: '변환 실패', count: 2, color: 'bg-[#f1c21b]' },
    { type: '파일 형식 오류', count: 1, color: 'bg-[#8a3ffc]' },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">
            에러 로그 모니터링
          </h3>
        </div>

        {/* Error Type Statistics */}
        <div className="mb-4 p-3 bg-muted/50">
          <h4 className="text-sm font-medium text-foreground mb-3">
            에러 유형별 통계
          </h4>
          <div className="space-y-3">
            {errorStats.map((stat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    {stat.type}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {stat.count}건
                  </span>
                </div>
                <div className="w-full bg-muted h-2">
                  <div
                    className={`${stat.color} h-2 transition-all duration-300`}
                    style={{ width: `${(stat.count / 11) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Errors Table */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            최근 발생한 에러 내역 상위 5개
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    에러 유형
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    에러 메시지
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    파일명
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    페이지
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    발생 시각
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {errors.map((error) => (
                  <tr
                    key={error.id}
                    onClick={() => setSelectedError(error)}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2">
                      <ErrorTypeBadge type={error.type} />
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-sm text-foreground">
                        {error.message}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-sm font-medium text-foreground font-mono">
                        {error.fileName}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-sm text-muted-foreground">
                        {error.pageNumber || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-sm text-muted-foreground">
                        {error.timestamp}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onViewAll}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            전체 에러 로그 보기 →
          </button>
        </div>

        <ErrorDetailModal
          error={selectedError}
          onClose={() => setSelectedError(null)}
        />
      </CardContent>
    </Card>
  )
}
