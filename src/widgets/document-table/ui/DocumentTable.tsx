import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { StatusBadge } from '@/shared/ui/status-badge'
import {
  useDocuments,
  useDownloadFile,
  useDeleteDocuments,
} from '@/entities/document'
import type { DocumentItem } from '@/shared/types'

interface DocumentWithSelection extends DocumentItem {
  selected: boolean
}

interface DocumentTableProps {
  onFileSelect: (fileId: string) => void
}

export function DocumentTable({ onFileSelect }: DocumentTableProps) {
  const { data, isLoading, refetch } = useDocuments()
  const downloadMutation = useDownloadFile()
  const deleteMutation = useDeleteDocuments()
  const [documents, setDocuments] = useState<DocumentWithSelection[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)
  const [activeRowDropdown, setActiveRowDropdown] = useState<string | null>(
    null,
  )
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const deleteDropdownRef = useRef<HTMLDivElement>(null)

  // API 데이터가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    if (data?.items) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing API data to local selection state
      setDocuments(data.items.map((d) => ({ ...d, selected: false })))
    }
  }, [data])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        deleteDropdownRef.current &&
        !deleteDropdownRef.current.contains(event.target as Node)
      )
        setShowDeleteDropdown(false)
      if (activeRowDropdown) {
        const dropdown = document.getElementById(
          `dropdown-${activeRowDropdown}`,
        )
        if (dropdown && !dropdown.contains(event.target as Node))
          setActiveRowDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeRowDropdown])

  const toggleDocSelection = (id: string) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.documentId === id ? { ...doc, selected: !doc.selected } : doc,
      ),
    )
  }

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setDocuments((docs) =>
      docs.map((doc) => ({ ...doc, selected: newSelectAll })),
    )
  }

  const handleDownload = async (documentId: string) => {
    try {
      const blob = await downloadMutation.mutateAsync(documentId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download =
        documents.find((d) => d.documentId === documentId)?.originalFilename ??
        'download'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // 에러는 mutation에서 처리
    }
  }

  const selectedCount = documents.filter((doc) => doc.selected).length
  const totalPages = Math.max(1, Math.ceil(documents.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDocuments = documents.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="bg-card border-border border p-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="bg-card border-border border">
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="border-border flex items-center gap-4 border-b px-4 py-3"
              >
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Top Control Bar */}
      <div className="bg-card border-border rounded-xl border p-3">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="text-muted-foreground text-sm">
            {selectedCount > 0
              ? `${selectedCount}개 파일 선택됨`
              : '선택된 파일 없음'}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-[#198038] text-white hover:bg-[#0e6027]"
              onClick={() => {
                documents
                  .filter((d) => d.selected)
                  .forEach((d) => handleDownload(d.documentId))
              }}
              disabled={selectedCount === 0}
            >
              <Download className="mr-1 h-4 w-4" />
              다운로드
            </Button>
            <div className="relative" ref={deleteDropdownRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDropdown(!showDeleteDropdown)}
                disabled={selectedCount === 0}
              >
                <Trash2 className="text-destructive h-5 w-5" />
              </Button>
              {showDeleteDropdown && selectedCount > 0 && (
                <div className="bg-card border-border absolute right-0 z-10 mt-1 w-40 border shadow-lg">
                  <button
                    onClick={() => {
                      const ids = documents
                        .filter((d) => d.selected)
                        .map((d) => d.documentId)
                      deleteMutation.mutate(ids)
                      setShowDeleteDropdown(false)
                      setSelectAll(false)
                    }}
                    disabled={deleteMutation.isPending}
                    className="hover:bg-accent text-foreground w-full px-4 py-2 text-left text-sm transition-colors disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? '삭제 중...' : '선택 항목 삭제'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-card border-border flex min-h-[calc(100dvh-11rem)] flex-col overflow-hidden rounded-xl border">
        {/* Table header + body */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-muted/50 border-border border-b">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4"
                  />
                </th>
                <th className="text-foreground px-4 py-3 text-left text-sm font-semibold">
                  문서명
                </th>
                <th className="text-foreground px-4 py-3 text-left text-sm font-semibold">
                  상태
                </th>
                <th className="text-foreground px-4 py-3 text-left text-sm font-semibold">
                  업로드 일시
                </th>
                <th className="text-foreground px-4 py-3 text-left text-sm font-semibold">
                  모델
                </th>
                <th className="text-foreground w-48 px-4 py-3 text-center text-sm font-semibold">
                  다운로드
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground px-4 py-8 text-center"
                  >
                    문서가 없습니다.
                  </td>
                </tr>
              ) : (
                paginatedDocuments.map((doc) => (
                  <tr key={doc.documentId} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={doc.selected}
                        onChange={() => toggleDocSelection(doc.documentId)}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onFileSelect(doc.documentId)}
                        className="text-foreground hover:text-foreground/80 text-left text-sm font-medium transition-colors hover:underline"
                      >
                        {doc.originalFilename}
                      </button>
                      <div className="text-muted-foreground text-xs">
                        {doc.fileType}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doc.latestStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground text-sm">
                        {new Date(doc.uploadedAt).toLocaleString('ko-KR')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-muted text-muted-foreground px-2 py-1 font-mono text-xs whitespace-nowrap">
                        {doc.modelCode || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDownload(doc.documentId)}
                        disabled={doc.latestStatus !== 'COMPLETED'}
                        className="hover:bg-accent inline-flex h-10 w-10 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Download className="h-6 w-6 text-[#198038]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — 항상 하단 고정 */}
        <div className="border-border bg-muted/30 mt-auto flex items-center justify-between border-t px-4 py-3">
          <div className="text-muted-foreground text-sm">
            {documents.length > 0
              ? `${startIndex + 1}-${Math.min(startIndex + itemsPerPage, documents.length)} / ${documents.length}`
              : '0개'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
    </div>
  )
}
