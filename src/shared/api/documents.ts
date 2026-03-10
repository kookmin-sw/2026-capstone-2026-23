import { api } from './client'

export interface Document {
  documentId: string
  originalFilename: string
  fileType: string
  uploadedAt: string
  latestStatus: string
}

export interface DocumentListResponse {
  success: boolean
  data: {
    items: Document[]
    nextCursor: string | null
  }
}

export interface SupportedTypesResponse {
  success: boolean
  data: {
    types: string[]
  }
}

export const getDocuments = (limit = 20) =>
  api.get<DocumentListResponse>('/documents', { params: { limit } })

export const uploadDocuments = (files: File[]) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  return api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getSupportedFileTypes = () =>
  api.get<SupportedTypesResponse>('/documents/types')
