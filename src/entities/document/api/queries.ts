import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  deleteDocument,
  downloadDocumentOriginal,
  getDocumentResult,
  getDocuments,
  previewDocumentOriginal,
  uploadFiles,
} from '@/shared/api'
import {
  MOCK_DOCUMENT_RESULT,
  MOCK_DOCUMENT_RESULT_ID,
} from '@/shared/lib/mock-document-result'
import type { DocumentItem, DocumentResult, UploadedFile } from '@/shared/types'

const TERMINAL_DOCUMENT_STATUSES = new Set(['COMPLETED', 'FAILED', 'CANCELED'])

function hasActiveDocuments(
  data: { items: DocumentItem[]; nextCursor: string | null } | undefined,
) {
  return (
    data?.items.some(
      (item) => !TERMINAL_DOCUMENT_STATUSES.has(item.latestStatus),
    ) ?? false
  )
}

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await getDocuments()
      return data as { items: DocumentItem[]; nextCursor: string | null }
    },
    refetchInterval: (query) =>
      hasActiveDocuments(query.state.data) ? 2000 : false,
  })
}

export function useDocumentResult(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'result'],
    queryFn: async () => {
      if (documentId === MOCK_DOCUMENT_RESULT_ID) {
        return MOCK_DOCUMENT_RESULT
      }
      const { data } = await getDocumentResult(documentId!)
      return data as DocumentResult
    },
    enabled: !!documentId,
  })
}

export function useDocumentOriginalFile(
  documentId: string | undefined,
  fileName: string | undefined,
) {
  return useQuery({
    queryKey: ['documents', documentId, 'original-file'],
    queryFn: async () => {
      const { data } = await downloadDocumentOriginal(documentId!)
      return new File([data], fileName ?? 'original', {
        type: data.type || undefined,
      })
    },
    enabled: !!documentId,
  })
}

export function useDocumentOriginalPreviewFile(
  documentId: string | undefined,
  fileName: string | undefined,
) {
  return useQuery({
    queryKey: ['documents', documentId, 'original-preview-file'],
    queryFn: async () => {
      const { data } = await previewDocumentOriginal(documentId!)
      return new File([data], fileName ?? 'original', {
        type: data.type || undefined,
      })
    },
    enabled: !!documentId,
  })
}

export function useUploadFiles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (files: File[]) => {
      const { data } = await uploadFiles(files)
      return data as { count: number; items: UploadedFile[] }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const { data } = await downloadDocumentOriginal(documentId)
      return data
    },
  })
}

export function useDeleteDocuments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (documentIds: string[]) => {
      const results = await Promise.allSettled(
        documentIds.map((id) => deleteDocument(id)),
      )
      const failed = results.filter((r) => r.status === 'rejected')
      if (failed.length > 0) {
        throw new Error(`${failed.length}건 삭제 실패`)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
