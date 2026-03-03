import { useState, useEffect, useRef } from 'react'
import { Download, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { DocumentItem } from '@/shared/types'

interface DocumentWithSelection extends DocumentItem {
  selected: boolean
}

interface DocumentTableProps {
  onFileSelect: (fileId: string) => void
}

const initialDocuments: DocumentWithSelection[] = [
  {
    id: '1',
    name: '건축구조설계서.hwp',
    date: '2026-02-10 14:32',
    convertedBy: '김철수',
    summary: '건축 구조 설계 관련 문서',
    hasOriginal: true,
    hasTmp: true,
    hasOutput: true,
    selected: false,
  },
  {
    id: '2',
    name: '프로젝트보고서.pdf',
    date: '2026-02-09 11:20',
    convertedBy: '이영희',
    summary: '2025년 4분기 프로젝트 최종 보고서',
    hasOriginal: true,
    hasTmp: false,
    hasOutput: true,
    selected: false,
  },
  {
    id: '3',
    name: '회의록_2026_02.hwp',
    date: '2026-02-08 16:45',
    convertedBy: '박민수',
    summary: '2월 정기 회의 내용 정리',
    hasOriginal: true,
    hasTmp: true,
    hasOutput: false,
    selected: false,
  },
  {
    id: '4',
    name: '기술문서_v2.pdf',
    date: '2026-02-07 09:15',
    convertedBy: '김철수',
    summary: 'API 기술 문서 버전 2',
    hasOriginal: true,
    hasTmp: true,
    hasOutput: true,
    selected: false,
  },
  {
    id: '5',
    name: '설계도면.png',
    date: '2026-02-06 13:50',
    convertedBy: '최지연',
    summary: '건축 설계 평면도',
    hasOriginal: true,
    hasTmp: false,
    hasOutput: true,
    selected: false,
  },
]

export function DocumentTable({ onFileSelect }: DocumentTableProps) {
  const [documents, setDocuments] = useState<DocumentWithSelection[]>(initialDocuments)
  const [selectAll, setSelectAll] = useState(false)
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)
  const [activeRowDropdown, setActiveRowDropdown] = useState<string | null>(
    null
  )
  const deleteDropdownRef = useRef<HTMLDivElement>(null)

  const loadDocuments = () => {
    setDocuments(initialDocuments.map((d) => ({ ...d, selected: false })))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        deleteDropdownRef.current &&
        !deleteDropdownRef.current.contains(event.target as Node)
      )
        setShowDeleteDropdown(false)
      if (activeRowDropdown) {
        const dropdown = document.getElementById(
          `dropdown-${activeRowDropdown}`
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
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      )
    )
  }

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setDocuments((docs) =>
      docs.map((doc) => ({ ...doc, selected: newSelectAll }))
    )
  }

  const downloadSelected = (type: 'original' | 'tmp' | 'output') => {
    const selectedDocs = documents.filter((doc) => doc.selected)
    if (selectedDocs.length === 0) return
    alert(`${selectedDocs.length}개의 ${type} 파일을 다운로드합니다.`)
  }

  const downloadSingle = (
    docId: string,
    type: 'original' | 'tmp' | 'output'
  ) => {
    const doc = documents.find((d) => d.id === docId)
    if (!doc) return
    alert(`"${doc.name}"의 ${type} 파일을 다운로드합니다.`)
  }

  const deleteSelected = (type: 'original' | 'tmp' | 'output') => {
    const selectedDocs = documents.filter((doc) => doc.selected)
    if (selectedDocs.length === 0) return
    setShowDeleteDropdown(false)
    setDocuments((docs) =>
      docs.map((doc) => {
        if (!doc.selected) return doc
        if (type === 'original') return { ...doc, hasOriginal: false }
        if (type === 'tmp') return { ...doc, hasTmp: false }
        return { ...doc, hasOutput: false }
      })
    )
  }

  const deleteSingle = (docId: string, type: 'original' | 'tmp' | 'output') => {
    setActiveRowDropdown(null)
    setDocuments((docs) =>
      docs.map((d) => {
        if (d.id !== docId) return d
        if (type === 'original') return { ...d, hasOriginal: false }
        if (type === 'tmp') return { ...d, hasTmp: false }
        return { ...d, hasOutput: false }
      })
    )
  }

  const selectedCount = documents.filter((doc) => doc.selected).length

  return (
    <div className="space-y-3">
      {/* Top Control Bar */}
      <div className="bg-card border border-border p-3">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={loadDocuments}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            {selectedCount > 0
              ? `${selectedCount}개 파일 선택됨`
              : '선택된 파일 없음'}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => downloadSelected('original')}
              disabled={selectedCount === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              원본
            </Button>
            <Button
              size="sm"
              className="bg-[#ff832b] hover:bg-[#ba4e00] text-white"
              onClick={() => downloadSelected('tmp')}
              disabled={selectedCount === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              tmp
            </Button>
            <Button
              size="sm"
              className="bg-[#198038] hover:bg-[#0e6027] text-white"
              onClick={() => downloadSelected('output')}
              disabled={selectedCount === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              output
            </Button>
            <div className="relative" ref={deleteDropdownRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDropdown(!showDeleteDropdown)}
                disabled={selectedCount === 0}
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
              {showDeleteDropdown && selectedCount > 0 && (
                <div className="absolute right-0 mt-1 w-40 bg-card border border-border shadow-lg z-10">
                  <button
                    onClick={() => deleteSelected('original')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-foreground transition-colors"
                  >
                    원본 삭제
                  </button>
                  <button
                    onClick={() => deleteSelected('tmp')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-foreground transition-colors border-t border-border"
                  >
                    tmp 삭제
                  </button>
                  <button
                    onClick={() => deleteSelected('output')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-foreground transition-colors border-t border-border"
                  >
                    output 삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 accent-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  문서명
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-64">
                  세부사항
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground w-24">
                  원본
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground w-24">
                  tmp
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground w-24">
                  output
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground w-24">
                  삭제
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    문서가 없습니다.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={doc.selected}
                        onChange={() => toggleDocSelection(doc.id)}
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onFileSelect(doc.id)}
                        className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
                      >
                        {doc.name}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm space-y-0.5">
                        <div className="text-muted-foreground">
                          <span className="font-medium">날짜:</span> {doc.date}
                        </div>
                        {doc.summary && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">요약:</span>{' '}
                            {doc.summary}
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          <span className="font-medium">변환자:</span>{' '}
                          {doc.convertedBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => downloadSingle(doc.id, 'original')}
                        disabled={!doc.hasOriginal}
                        className="inline-flex items-center justify-center w-10 h-10 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Download className="h-6 w-6 text-primary" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => downloadSingle(doc.id, 'tmp')}
                        disabled={!doc.hasTmp}
                        className="inline-flex items-center justify-center w-10 h-10 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Download className="h-6 w-6 text-[#ff832b]" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => downloadSingle(doc.id, 'output')}
                        disabled={!doc.hasOutput}
                        className="inline-flex items-center justify-center w-10 h-10 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Download className="h-6 w-6 text-[#198038]" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div
                        className="relative"
                        id={`dropdown-${doc.id}`}
                      >
                        <button
                          onClick={() =>
                            setActiveRowDropdown(
                              activeRowDropdown === doc.id ? null : doc.id
                            )
                          }
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-[#fff1f1] transition-colors"
                        >
                          <Trash2 className="h-6 w-6 text-destructive" />
                        </button>
                        {activeRowDropdown === doc.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-card border border-border shadow-lg z-10">
                            <button
                              onClick={() =>
                                deleteSingle(doc.id, 'original')
                              }
                              disabled={!doc.hasOriginal}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              원본 삭제
                            </button>
                            <button
                              onClick={() => deleteSingle(doc.id, 'tmp')}
                              disabled={!doc.hasTmp}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-foreground transition-colors border-t border-border disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              tmp 삭제
                            </button>
                            <button
                              onClick={() =>
                                deleteSingle(doc.id, 'output')
                              }
                              disabled={!doc.hasOutput}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-foreground transition-colors border-t border-border disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              output 삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
