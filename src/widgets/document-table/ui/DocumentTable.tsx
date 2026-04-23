import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Trash2,
  FileText,
  ArrowDownToLine,
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
      <div className="flex h-full flex-col gap-3">
        <div className="bg-card border-border rounded-xl border p-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </div>
        <div className="bg-card border-border flex-1 rounded-xl border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-border flex items-center gap-6 border-b px-5 py-4"
            >
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* ── 컨트롤 바 ── */}
      <div className="bg-card border-border rounded-xl border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <span className="text-muted-foreground text-xs">
            {selectedCount > 0 ? (
              <span className="text-primary font-semibold">
                {selectedCount}개 선택
              </span>
            ) : (
              `총 ${documents.length}개`
            )}
          </span>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={() => {
                documents
                  .filter((d) => d.selected)
                  .forEach((d) => handleDownload(d.documentId))
              }}
              disabled={selectedCount === 0}
              className="h-8 gap-1.5 rounded-lg bg-[#198038] px-3 text-xs text-white hover:bg-[#0e6027]"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              다운로드
            </Button>

            <div className="relative" ref={deleteDropdownRef}>
              <button
                onClick={() => setShowDeleteDropdown(!showDeleteDropdown)}
                disabled={selectedCount === 0}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg p-2 transition-colors disabled:pointer-events-none disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {showDeleteDropdown && selectedCount > 0 && (
                <div className="bg-card border-border absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-xl border shadow-xl">
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
                    className="text-destructive hover:bg-destructive/5 w-full px-4 py-2.5 text-left text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deleteMutation.isPending
                      ? '삭제 중...'
                      : `${selectedCount}개 항목 삭제`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 테이블 ── */}
      <div className="bg-card border-border flex flex-1 flex-col overflow-hidden rounded-xl border">
        <div className="flex-1 overflow-auto">
          <table className="w-full table-fixed">
            {/* 헤더 */}
            <thead className="bg-card sticky top-0 z-10">
              <tr className="border-border border-b">
                <th className="w-12 px-5 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4"
                  />
                </th>
                <th className="text-muted-foreground w-[38%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                  문서명
                </th>
                <th className="text-muted-foreground w-[14%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                  상태
                </th>
                <th className="text-muted-foreground w-[24%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                  업로드 일시
                </th>
                <th className="text-muted-foreground w-[14%] px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase">
                  모델
                </th>
                <th className="text-muted-foreground w-24 px-4 py-3 text-center text-[11px] font-semibold tracking-wide uppercase">
                  다운로드
                </th>
              </tr>
            </thead>

            {/* 바디 */}
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <FileText className="text-muted-foreground/30 mx-auto mb-2 h-8 w-8" />
                    <p className="text-muted-foreground text-sm">
                      문서가 없습니다
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedDocuments.map((doc) => {
                  const isSelected = doc.selected
                  return (
                    <tr
                      key={doc.documentId}
                      className={`group transition-colors ${
                        isSelected ? 'bg-primary/[0.03]' : 'hover:bg-muted/40'
                      }`}
                    >
                      <td className="border-border border-b px-5 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleDocSelection(doc.documentId)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="border-border border-b px-4 py-3.5 align-top">
                        <button
                          onClick={() => onFileSelect(doc.documentId)}
                          className="text-foreground group-hover:text-primary block w-full text-left text-sm font-medium break-all transition-colors"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {doc.originalFilename}
                        </button>
                        <p className="text-muted-foreground/60 mt-0.5 font-mono text-[10px] uppercase">
                          {doc.fileType}
                        </p>
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <StatusBadge status={doc.latestStatus} />
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <span className="text-muted-foreground text-sm tabular-nums">
                          {new Date(doc.uploadedAt).toLocaleString('ko-KR')}
                        </span>
                      </td>
                      <td className="border-border border-b px-4 py-3.5">
                        <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-[10px]">
                          {doc.modelCode || '—'}
                        </span>
                      </td>
                      <td className="border-border border-b px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleDownload(doc.documentId)}
                          disabled={doc.latestStatus !== 'COMPLETED'}
                          className="hover:bg-muted inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-20"
                        >
                          <Download className="h-4 w-4 text-[#198038]" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── 페이지네이션 — 하단 고정 ── */}
        <div className="border-border mt-auto flex items-center justify-between border-t px-5 py-2.5">
          <span className="text-muted-foreground font-mono text-xs tabular-nums">
            {documents.length > 0
              ? `${startIndex + 1}–${Math.min(startIndex + itemsPerPage, documents.length)} / ${documents.length}`
              : '0'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
    </div>
  )
}
