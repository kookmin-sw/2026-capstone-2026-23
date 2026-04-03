import { useState } from 'react'
import {
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react'
import { ErrorTypeBadge } from '@/shared/ui/error-type-badge'
import { ErrorDetailModal } from '@/shared/ui/error-detail-modal'
import { MockIndicator } from '@/shared/ui/mock-indicator'
import { useUIStore } from '@/app/model/ui-store'
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

export function ErrorLogPage() {
  const { isMockMode } = useUIStore()
  const [selectedError, setSelectedError] = useState<ErrorDetail | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const allErrors = isMockMode ? MOCK_ERRORS : []

  const filteredErrors = allErrors.filter((error) => {
    const matchesSearch =
      error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || error.type === filterType
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredErrors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedErrors = filteredErrors.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const errorTypes = [
    'all',
    'VLM 타임아웃',
    '메모리 부족',
    '변환 실패',
    '파일 형식 오류',
  ]

  return (
    <MockIndicator label="에러 로그">
      <div className="space-y-3">
        <div>
          <h2 className="text-foreground flex items-center gap-2 text-2xl font-bold">
            <AlertTriangle className="text-destructive h-6 w-6" />
            전체 에러 로그
          </h2>
          <p className="text-muted-foreground text-sm">
            시스템에서 발생한 모든 에러를 확인하고 관리하세요
          </p>
        </div>

        {allErrors.length === 0 ? (
          <div className="bg-card border-border flex flex-col items-center justify-center rounded-xl border py-16">
            <Inbox className="text-muted-foreground/40 mb-3 h-12 w-12" />
            <p className="text-muted-foreground text-sm font-medium">
              에러 로그가 없습니다
            </p>
            <p className="text-muted-foreground/60 mt-1 text-xs">
              에러가 발생하면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-card border-border border p-3">
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
                    className="border-border bg-card focus:ring-primary w-full border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
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
                    className="border-border bg-card focus:ring-primary border px-3 py-2 focus:ring-2 focus:outline-none"
                  >
                    {errorTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === 'all' ? '전체 유형' : type}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="border-border hover:bg-muted flex items-center gap-2 border px-4 py-2 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">기간 선택</span>
                </button>
              </div>
              <div className="text-muted-foreground mt-3 flex items-center justify-between text-sm">
                <span>총 {filteredErrors.length}개의 에러</span>
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
            <div className="bg-card border-border overflow-hidden border">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead className="bg-muted/50 border-border border-b">
                    <tr>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                        ID
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                        유형
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                        에러 메시지
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                        파일명
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                        페이지
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                        모델
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                        발생 시각
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y">
                    {paginatedErrors.map((error) => (
                      <tr
                        key={error.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground font-mono text-sm">
                            #{error.id}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <ErrorTypeBadge type={error.type} />
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-foreground max-w-md truncate text-sm">
                            {error.message}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-foreground font-mono text-sm">
                            {error.fileName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground text-sm">
                            {error.pageNumber
                              ? `Page ${error.pageNumber}`
                              : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-muted text-muted-foreground px-2 py-1 font-mono text-xs whitespace-nowrap">
                            {error.model || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground text-sm">
                            {error.timestamp}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedError(error)}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
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
              <div className="border-border bg-muted/30 flex items-center justify-between border-t px-4 py-3">
                <div className="text-muted-foreground text-sm">
                  {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredErrors.length)} /{' '}
                  {filteredErrors.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="border-border hover:bg-card border px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-foreground text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="border-border hover:bg-card border px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
          </>
        )}
      </div>
    </MockIndicator>
  )
}
