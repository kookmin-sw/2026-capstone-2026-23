import { useState } from 'react'
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
} from 'lucide-react'
import { ErrorTypeBadge } from '@/shared/ui/error-type-badge'
import { ErrorDetailModal } from '@/shared/ui/error-detail-modal'
import { useUIStore } from '@/app/model/ui-store'
import { useErrorSummary, useErrors } from '@/entities/error-log'
import type { ErrorDetail } from '@/shared/types'

const MOCK_ERRORS: ErrorDetail[] = [
  {
    id: '1',
    message: 'VLM 타임아웃: 응답 시간 초과 (30초)',
    fileName: 'large_document.pdf',
    timestamp: '2024-12-09 14:05:23',
    type: 'VLM 타임아웃',
    filePath: 'data/inputs/large_document.pdf',
    pageNumber: 15,
    model: 'gpt-5.2',
    stackTrace: 'TimeoutError: Request timeout after 30 seconds',
  },
  {
    id: '2',
    message: '메모리 부족: 페이지 처리 중 메모리 할당 실패',
    fileName: 'high_res_scan.tiff',
    timestamp: '2024-12-09 13:42:15',
    type: '메모리 부족',
    filePath: 'data/inputs/high_res_scan.tiff',
    pageNumber: 1,
    model: 'gpt-5.2',
    stackTrace: 'MemoryError: Unable to allocate 1.2GB',
  },
  {
    id: '3',
    message: '변환 실패: HWP 파일 형식 오류',
    fileName: 'corrupted_file.hwp',
    timestamp: '2024-12-09 12:18:45',
    type: '변환 실패',
    filePath: 'data/inputs/corrupted_file.hwp',
    model: 'gpt-5.2',
    stackTrace: 'InvalidHWPFormat: File header signature mismatch',
  },
  {
    id: '4',
    message: 'VLM 타임아웃: 응답 시간 초과 (30초)',
    fileName: 'report_2024.pdf',
    timestamp: '2024-12-09 11:30:12',
    type: 'VLM 타임아웃',
    filePath: 'data/inputs/report_2024.pdf',
    pageNumber: 8,
    model: 'gpt-5.2',
  },
  {
    id: '5',
    message: '파일 형식 오류: 지원하지 않는 이미지 형식',
    fileName: 'diagram.webp',
    timestamp: '2024-12-09 10:15:33',
    type: '파일 형식 오류',
    filePath: 'data/inputs/diagram.webp',
    model: 'deepseek-ocr-2',
  },
  {
    id: '6',
    message: 'VLM 타임아웃: 응답 시간 초과 (30초)',
    fileName: 'technical_spec.hwp',
    timestamp: '2024-12-09 09:45:28',
    type: 'VLM 타임아웃',
    filePath: 'data/inputs/technical_spec.hwp',
    pageNumber: 23,
    model: 'gpt-5.2',
  },
  {
    id: '7',
    message: '메모리 부족: 페이지 처리 중 메모리 할당 실패',
    fileName: 'blueprint.tiff',
    timestamp: '2024-12-09 08:22:19',
    type: '메모리 부족',
    filePath: 'data/inputs/blueprint.tiff',
    pageNumber: 1,
    model: 'gpt-5.2',
  },
  {
    id: '8',
    message: '변환 실패: PDF 파싱 오류',
    fileName: 'encrypted.pdf',
    timestamp: '2024-12-08 16:50:41',
    type: '변환 실패',
    filePath: 'data/inputs/encrypted.pdf',
    model: 'gpt-5.2',
  },
  {
    id: '9',
    message: 'VLM 타임아웃: 응답 시간 초과 (30초)',
    fileName: 'presentation.pdf',
    timestamp: '2024-12-08 15:33:07',
    type: 'VLM 타임아웃',
    filePath: 'data/inputs/presentation.pdf',
    pageNumber: 12,
    model: 'gpt-5-mini',
  },
  {
    id: '10',
    message: '메모리 부족: 페이지 처리 중 메모리 할당 실패',
    fileName: 'large_scan.bmp',
    timestamp: '2024-12-08 14:18:52',
    type: '메모리 부족',
    filePath: 'data/inputs/large_scan.bmp',
    pageNumber: 1,
    model: 'deepseek-ocr-2',
  },
  {
    id: '11',
    message: '변환 실패: HWP 파일 형식 오류',
    fileName: 'old_format.hwp',
    timestamp: '2024-12-08 13:05:36',
    type: '변환 실패',
    filePath: 'data/inputs/old_format.hwp',
    model: 'gpt-5.2',
  },
]

export function ErrorTable() {
  const { isMockMode } = useUIStore()
  const [selectedError, setSelectedError] = useState<ErrorDetail | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const apiErrors = useErrors(
    {
      q: searchQuery || undefined,
      type: filterType === 'all' ? undefined : filterType,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    },
    !isMockMode,
  )
  const errorSummary = useErrorSummary(!isMockMode)

  const filteredMockErrors = MOCK_ERRORS.filter((error) => {
    const matchesSearch =
      error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || error.type === filterType
    return matchesSearch && matchesFilter
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMockErrors = filteredMockErrors.slice(
    startIndex,
    startIndex + itemsPerPage,
  )
  const totalErrors = isMockMode
    ? filteredMockErrors.length
    : (apiErrors.data?.total ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalErrors / itemsPerPage))
  const visibleErrors = isMockMode
    ? paginatedMockErrors
    : (apiErrors.data?.items ?? [])
  const isInitialLoading = !isMockMode && apiErrors.isLoading
  const isError = !isMockMode && apiErrors.isError

  const mockErrorTypes = [
    'all',
    'VLM 타임아웃',
    '메모리 부족',
    '변환 실패',
    '파일 형식 오류',
  ]
  const errorTypes = isMockMode
    ? mockErrorTypes
    : ['all', ...Object.keys(errorSummary.data?.byType ?? {})]
  const paginationStart = totalErrors === 0 ? 0 : startIndex + 1

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isInitialLoading ? (
        <div className="bg-card border-border flex flex-1 flex-col items-center justify-center rounded-xl border">
          <Loader2 className="text-primary mb-3 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">
            에러 로그를 불러오는 중입니다
          </p>
        </div>
      ) : isError ? (
        <div className="bg-card border-border flex flex-1 flex-col items-center justify-center rounded-xl border">
          <AlertTriangle className="text-destructive mb-3 h-10 w-10" />
          <p className="text-destructive text-sm font-medium">
            에러 로그를 불러오지 못했습니다
          </p>
        </div>
      ) : visibleErrors.length === 0 && !searchQuery && filterType === 'all' ? (
        <div className="bg-card border-border flex flex-1 flex-col items-center justify-center rounded-xl border">
          <Inbox className="text-muted-foreground/40 mb-3 h-12 w-12" />
          <p className="text-muted-foreground text-sm font-medium">
            에러 로그가 없습니다
          </p>
          <p className="text-muted-foreground/60 mt-1 text-xs">
            에러가 발생하면 여기에 표시됩니다
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          {/* Filters */}
          <div className="bg-card border-border relative z-30 rounded-xl border px-4 py-2.5">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <input
                  type="text"
                  placeholder="파일명 검색..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="border-border bg-card focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-4 w-4" />
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="border-border bg-card focus:ring-primary rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  {errorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? '전체 유형' : type}
                    </option>
                  ))}
                </select>
              </div>
              {/* <button className="border-border hover:bg-muted flex items-center gap-2 border px-4 py-2 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">기간 선택</span>
                </button> */}
            </div>
            <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
              <span>총 {totalErrors}개</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:text-primary/80"
                >
                  검색 초기화
                </button>
              )}
            </div>
          </div>

          {/* Error Table */}
          <div className="bg-card border-border flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
            <div className="flex-1 overflow-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="bg-card sticky top-0 z-10">
                  <tr className="border-border border-b">
                    <th className="text-muted-foreground w-20 px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                      ID
                    </th>
                    <th className="text-muted-foreground w-[14%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                      유형
                    </th>
                    <th className="text-muted-foreground w-[28%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                      에러 메시지
                    </th>
                    <th className="text-muted-foreground w-[18%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                      파일명
                    </th>
                    <th className="text-muted-foreground w-20 px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                      페이지
                    </th>
                    <th className="text-muted-foreground w-[12%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                      모델
                    </th>
                    <th className="text-muted-foreground w-[16%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                      발생 시각
                    </th>
                    <th className="text-muted-foreground w-24 px-4 py-3 text-center text-[11px] font-semibold tracking-wide uppercase">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleErrors.map((error) => (
                    <tr
                      key={error.id}
                      className="group hover:bg-muted/40 transition-colors"
                    >
                      <td className="border-border border-b px-4 py-3.5">
                        <span className="text-muted-foreground font-mono text-sm">
                          #{error.id}
                        </span>
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <ErrorTypeBadge type={error.type} />
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <p className="text-foreground max-w-md truncate text-sm">
                          {error.message}
                        </p>
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <span className="text-foreground block truncate font-mono text-sm">
                          {error.fileName}
                        </span>
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <span className="text-muted-foreground text-sm">
                          {error.pageNumber ? `Page ${error.pageNumber}` : '-'}
                        </span>
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-[10px] whitespace-nowrap">
                          {error.model || '-'}
                        </span>
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <span className="text-muted-foreground text-sm tabular-nums">
                          {new Date(error.timestamp).toLocaleString('ko-KR')}
                        </span>
                      </td>
                      <td className="border-border border-b px-4 py-3.5 text-center">
                        <button
                          onClick={() => setSelectedError(error)}
                          className="text-primary hover:bg-primary/5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-border mt-auto flex items-center justify-between border-t px-5 py-2.5">
              <div className="text-muted-foreground font-mono text-xs tabular-nums">
                {paginationStart}-
                {Math.min(startIndex + itemsPerPage, totalErrors)} /{' '}
                {totalErrors}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-foreground min-w-[3rem] text-center text-xs font-medium tabular-nums">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {selectedError && (
            <ErrorDetailModal
              error={selectedError}
              onClose={() => setSelectedError(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}
