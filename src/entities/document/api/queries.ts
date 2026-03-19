import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  downloadFile,
  getDocumentResult,
  getDocuments,
  uploadFiles,
} from '@/shared/api'
import type { DocumentItem, DocumentResult, UploadedFile } from '@/shared/types'

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await getDocuments()
      return data as { items: DocumentItem[]; nextCursor: string | null }
    },
  })
}

export function useDocumentResult(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'result'],
    queryFn: async () => {
      const { data } = await getDocumentResult(documentId!)
      return data as DocumentResult
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
    mutationFn: async (fileId: string) => {
      const { data } = await downloadFile(fileId)
      return data
    },
  })
}
