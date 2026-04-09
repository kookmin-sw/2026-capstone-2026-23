import { api } from './client'

import type { DocumentItem, DocumentResult, UploadedFile } from '@/shared/types'

// 파일 업로드 (POST /files/upload)
export const uploadFiles = (files: File[]) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  return api.post<{ count: number; items: UploadedFile[] }>(
    '/files/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
}

// 파일 다운로드 (GET /files/download/{fileId})
export const downloadFile = (fileId: string) =>
  api.get<Blob>(`/files/download/${fileId}`, { responseType: 'blob' })

// 문서 목록 (GET /documents)
export const getDocuments = (limit = 50) =>
  api.get<{ items: DocumentItem[]; nextCursor: string | null }>('/documents', {
    params: { limit },
  })

// 지원 파일 타입 (GET /documents/types)
export const getSupportedFileTypes = () =>
  api.get<{ types: string[] }>('/documents/types')

// 문서 결과 (GET /documents/{documentId}/result)
export const getDocumentResult = (documentId: string) =>
  api.get<DocumentResult>(`/documents/${documentId}/result`)

// 문서 삭제 (DELETE /documents/{documentId})
export const deleteDocument = (documentId: string) =>
  api.delete(`/documents/${documentId}`)
