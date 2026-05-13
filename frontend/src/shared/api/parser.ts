import { api } from './client'
import { DEFAULT_MODEL_ID } from '@/shared/config/models'

import type {
  ConvertResult,
  DocumentResult,
  JobStatusData,
  JobItemsData,
} from '@/shared/types'

export interface ConvertParams {
  files: File[]
  userId?: string
  modelId?: string
  duplicatePolicy?: 'OVERWRITE' | 'KEEP_BOTH'
  parallelism?: number
  language?: string
}

// 문서 변환 Job 생성 (POST /parser/jobs) — 큐에 등록 후 jobId 즉시 반환
export const convertDocuments = ({
  files,
  userId = 'u-demo',
  modelId = DEFAULT_MODEL_ID,
  parallelism = 1,
  language = '한국어',
}: ConvertParams) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  formData.append('userId', userId)
  formData.append('modelId', modelId)
  formData.append('parallelism', String(parallelism))
  formData.append('language', language)
  return api.post<ConvertResult>('/parser/jobs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// Job 상태 조회 (GET /parser/jobs/{jobId})
export const getJobStatus = (jobId: string) =>
  api.get<JobStatusData>(`/parser/jobs/${jobId}`)

// Job Item 목록 조회 (GET /parser/jobs/{jobId}/items)
export const getJobItems = (jobId: string) =>
  api.get<JobItemsData>(`/parser/jobs/${jobId}/items`)

// Job 취소 (POST /parser/jobs/{jobId}/cancel)
export const cancelJob = (jobId: string, force = false) =>
  api.post<JobStatusData>(`/parser/jobs/${jobId}/cancel`, null, {
    params: force ? { force: true } : undefined,
  })

// 문서 처리 진행률 (GET /parser/documents/{documentId}/progress)
export const getDocumentProgress = (documentId: string) =>
  api.get(`/parser/documents/${documentId}/progress`)

// 문서 처리 결과 (GET /parser/documents/{documentId}/result)
export const getDocumentParserResult = (documentId: string) =>
  api.get<DocumentResult>(`/parser/documents/${documentId}/result`)
