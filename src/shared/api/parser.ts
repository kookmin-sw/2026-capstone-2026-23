import { api } from './client'

import type {
  ConvertResult,
  DocumentResult,
  JobStatusData,
} from '@/shared/types'

export interface ConvertParams {
  files: File[]
  userId?: string
  modelId?: string
  duplicatePolicy?: 'OVERWRITE' | 'KEEP_BOTH'
  parallelism?: number
  language?: string
}

// 문서 변환 (POST /parser/convert)
export const convertDocuments = ({
  files,
  userId = 'u-demo',
  modelId = 'm1',
  duplicatePolicy = 'OVERWRITE',
  parallelism = 1,
  language = '한국어',
}: ConvertParams) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  formData.append('userId', userId)
  formData.append('modelId', modelId)
  formData.append('duplicatePolicy', duplicatePolicy)
  formData.append('parallelism', String(parallelism))
  formData.append('language', language)
  return api.post<ConvertResult>('/parser/convert', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 600000, // 변환은 오래 걸릴 수 있으므로 10분
  })
}

// Job 상태 조회 (GET /parser/jobs/{jobId})
export const getJobStatus = (jobId: string) =>
  api.get<JobStatusData>(`/parser/jobs/${jobId}`)

// Job 취소 (POST /parser/jobs/{jobId}/cancel)
export const cancelJob = (jobId: string) =>
  api.post<JobStatusData>(`/parser/jobs/${jobId}/cancel`)

// 문서 처리 진행률 (GET /parser/documents/{documentId}/progress)
export const getDocumentProgress = (documentId: string) =>
  api.get(`/parser/documents/${documentId}/progress`)

// 문서 처리 결과 (GET /parser/documents/{documentId}/result)
export const getDocumentParserResult = (documentId: string) =>
  api.get<DocumentResult>(`/parser/documents/${documentId}/result`)
