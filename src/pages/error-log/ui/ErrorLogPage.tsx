import { useState } from 'react'
import { AlertTriangle, Search, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { ErrorTypeBadge } from '@/shared/ui/error-type-badge'
import { ErrorDetailModal } from '@/shared/ui/error-detail-modal'
import type { ErrorDetail } from '@/shared/types'

export function ErrorLogPage() {
  const [selectedError, setSelectedError] = useState<ErrorDetail | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const allErrors: ErrorDetail[] = [
    { id: '1', message: 'VLM 타임아웃: 응답 시간 초과 (30초)', fileName: 'large_document.pdf', timestamp: '2024-12-09 14:05:23', type: 'VLM 타임아웃', filePath: 'data/inputs/large_document.pdf', pageNumber: 15, model: 'gpt-5.2', stackTrace: 'TimeoutError: Request timeout after 30 seconds' },
    { id: '2', message: '메모리 부족: 페이지 처리 중 메모리 할당 실패', fileName: 'high_res_scan.tiff', timestamp: '2024-12-09 13:42:15', type: '메모리 부족', filePath: 'data/inputs/high_res_scan.tiff', pageNumber: 1, model: 'gpt-5.2', stackTrace: 'MemoryError: Unable to allocate 1.2GB' },
    { id: '3', message: '변환 실패: HWP 파일 형식 오류', fileName: 'corrupted_file.hwp', timestamp: '2024-12-09 12:18:45', type: '변환 실패', filePath: 'data/inputs/corrupted_file.hwp', model: 'gpt-5.2', stackTrace: 'InvalidHWPFormat: File header signature mismatch' },
    { id: '4', message: 'VLM 타임아웃: 응답 시간 초과 (30초)', fileName: 'report_2024.pdf', timestamp: '2024-12-09 11:30:12', type: 'VLM 타임아웃', filePath: 'data/inputs/report_2024.pdf', pageNumber: 8, model: 'gpt-5.2' },
    { id: '5', message: '파일 형식 오류: 지원하지 않는 이미지 형식', fileName: 'diagram.webp', timestamp: '2024-12-09 10:15:33', type: '파일 형식 오류', filePath: 'data/inputs/diagram.webp', model: 'deepseek-ocr-2' },
    { id: '6', message: 'VLM 타임아웃: 응답 시간 초과 (30초)', fileName: 'technical_spec.hwp', timestamp: '2024-12-09 09:45:28', type: 'VLM 타임아웃', filePath: 'data/inputs/technical_spec.hwp', pageNumber: 23, model: 'gpt-5.2' },
    { id: '7', message: '메모리 부족: 페이지 처리 중 메모리 할당 실패', fileName: 'blueprint.tiff', timestamp: '2024-12-09 08:22:19', type: '메모리 부족', filePath: 'data/inputs/blueprint.tiff', pageNumber: 1, model: 'gpt-5.2' },
    { id: '8', message: '변환 실패: PDF 파싱 오류', fileName: 'encrypted.pdf', timestamp: '2024-12-08 16:50:41', type: '변환 실패', filePath: 'data/inputs/encrypted.pdf', model: 'gpt-5.2' },
    { id: '9', message: 'VLM 타임아웃: 응답 시간 초과 (30초)', fileName: 'presentation.pdf', timestamp: '2024-12-08 15:33:07', type: 'VLM 타임아웃', filePath: 'data/inputs/presentation.pdf', pageNumber: 12, model: 'gpt-5-mini' },
    { id: '10', message: '메모리 부족: 페이지 처리 중 메모리 할당 실패', fileName: 'large_scan.bmp', timestamp: '2024-12-08 14:18:52', type: '메모리 부족', filePath: 'data/inputs/large_scan.bmp', pageNumber: 1, model: 'deepseek-ocr-2' },
    { id: '11', message: '변환 실패: HWP 파일 형식 오류', fileName: 'old_format.hwp', timestamp: '2024-12-08 13:05:36', type: '변환 실패', filePath: 'data/inputs/old_format.hwp', model: 'gpt-5.2' },
  ]

  const filteredErrors = allErrors.filter((error) => {
    const matchesSearch = error.message.toLowerCase().includes(searchQuery.toLowerCase()) || error.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || error.type === filterType
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredErrors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedErrors = filteredErrors.slice(startIndex, startIndex + itemsPerPage)

  const errorTypes = ['all', 'VLM 타임아웃', '메모리 부족', '변환 실패', '파일 형식 오류']

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-7 w-7 text-destructive" />
          전체 에러 로그
        </h2>
        <p className="text-muted-foreground mt-1">시스템에서 발생한 모든 에러를 확인하고 관리하세요</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="파일명 검색..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="w-full pl-10 pr-4 py-2 border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1) }}
              className="px-3 py-2 border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {errorTypes.map((type) => (
                <option key={type} value={type}>{type === 'all' ? '전체 유형' : type}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted transition-colors">
            <Calendar className="h-4 w-4" /><span className="text-sm">기간 선택</span>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>총 {filteredErrors.length}개의 에러</span>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-primary hover:text-primary/80">검색 초기화</button>
          )}
        </div>
      </div>

      {/* Error Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">유형</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">에러 메시지</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">파일명</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">페이지</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">모델</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">발생 시각</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedErrors.map((error) => (
                <tr key={error.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3"><span className="text-sm font-mono text-muted-foreground">#{error.id}</span></td>
                  <td className="px-4 py-3"><ErrorTypeBadge type={error.type} /></td>
                  <td className="px-4 py-3"><p className="text-sm text-foreground max-w-md truncate">{error.message}</p></td>
                  <td className="px-4 py-3"><span className="text-sm text-foreground font-mono">{error.fileName}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-muted-foreground">{error.pageNumber ? `Page ${error.pageNumber}` : '-'}</span></td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 whitespace-nowrap bg-muted text-muted-foreground font-mono">{error.model || '-'}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-muted-foreground">{error.timestamp}</span></td>
                  <td className="px-4 py-3"><button onClick={() => setSelectedError(error)} className="text-sm text-primary hover:text-primary/80 font-medium">상세보기</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredErrors.length)} / {filteredErrors.length}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-border hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-sm text-foreground font-medium">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-border hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {selectedError && <ErrorDetailModal error={selectedError} onClose={() => setSelectedError(null)} />}
    </div>
  )
}
