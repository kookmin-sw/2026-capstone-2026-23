import { useMemo, useState } from 'react'
import { Bot, CheckCircle, FileText, RefreshCw } from 'lucide-react'
import { ChatModal } from '@/widgets/chat-modal'
import { useDocuments, useDocumentResult } from '@/entities/document'
import { Skeleton } from '@/shared/ui/skeleton'
import type { DocumentItem } from '@/shared/types'

function isChatReadyDocument(document: DocumentItem) {
  return document.latestStatus === 'COMPLETED' && Boolean(document.outputPath)
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RagPage() {
  const { data, isLoading, refetch, isFetching } = useDocuments()
  const documents = useMemo(() => data?.items ?? [], [data?.items])
  const readyDocuments = useMemo(
    () => documents.filter(isChatReadyDocument),
    [documents],
  )
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  )

  const effectiveSelectedDocumentId =
    selectedDocumentId &&
    readyDocuments.some(
      (document) => document.documentId === selectedDocumentId,
    )
      ? selectedDocumentId
      : (readyDocuments[0]?.documentId ?? null)
  const selectedDocument =
    readyDocuments.find(
      (document) => document.documentId === effectiveSelectedDocumentId,
    ) ?? null
  const { data: selectedResult } = useDocumentResult(
    selectedDocument?.documentId,
  )
  const selectedPath = selectedResult?.txt.path ?? selectedDocument?.outputPath
  const selectedName =
    selectedResult?.fileName ?? selectedDocument?.originalFilename ?? ''

  return (
    <div className="flex h-[calc(100dvh-2rem)] min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground flex items-center gap-2 text-2xl font-bold">
            <Bot className="text-primary h-6 w-6" />
            RAG Chat
          </h2>
          <p className="text-muted-foreground text-sm">
            Ask questions against completed document outputs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)] gap-3">
        <aside className="border-border bg-card flex min-h-0 flex-col rounded-lg border">
          <div className="border-border flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-foreground text-sm font-semibold">Documents</p>
              <p className="text-muted-foreground text-xs">
                {readyDocuments.length} ready
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : readyDocuments.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <FileText className="text-muted-foreground/30 mb-3 h-8 w-8" />
                <p className="text-foreground text-sm font-medium">
                  No completed documents
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Convert a document first, then come back to chat.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {readyDocuments.map((document) => {
                  const isSelected =
                    document.documentId === effectiveSelectedDocumentId
                  return (
                    <button
                      key={document.documentId}
                      type="button"
                      onClick={() => setSelectedDocumentId(document.documentId)}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted border-transparent'
                      }`}
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#198038]" />
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {document.originalFilename}
                          </p>
                          <p className="text-muted-foreground mt-1 truncate text-xs">
                            {document.modelCode || 'model unknown'} -{' '}
                            {formatDate(document.uploadedAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </aside>

        <section className="min-h-0">
          {selectedDocument ? (
            <ChatModal
              variant="panel"
              isOpen
              onClose={() => undefined}
              selectedFile={selectedPath ?? selectedDocument.documentId}
              documentId={selectedDocument.documentId}
              documentPath={selectedPath}
              fileName={selectedName}
            />
          ) : (
            <div className="border-border bg-card flex h-full items-center justify-center rounded-lg border">
              <div className="text-center">
                <Bot className="text-muted-foreground/30 mx-auto mb-3 h-10 w-10" />
                <p className="text-foreground text-sm font-medium">
                  Select a completed document
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  RAG chat becomes available after conversion finishes.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
