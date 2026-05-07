import { useQuery } from '@tanstack/react-query'

import { api } from '@/shared/api'
import type { ErrorDetail } from '@/shared/types'

interface UseErrorsParams {
  q?: string
  type?: string
  limit?: number
  offset?: number
}

interface ErrorsResponse {
  items: ErrorDetail[]
  total: number
  limit: number
  offset: number
}

interface ErrorSummaryResponse {
  totalErrors: number
  byType: Record<string, number>
  recent: ErrorDetail[]
}

interface BackendErrorRecord {
  errorId?: string
  id?: string
  type?: string
  message?: string
  fileName?: string | null
  filePath?: string | null
  page?: number | null
  pageNumber?: number | null
  model?: string | null
  occurredAt?: string | null
  timestamp?: string | null
  raw?: unknown
}

interface BackendErrorsResponse {
  items: BackendErrorRecord[]
  total: number
  limit: number
  offset: number
}

interface BackendErrorSummaryResponse {
  totalErrors: number
  byType: Record<string, number>
  recent: BackendErrorRecord[]
}

function mapErrorRecord(record: BackendErrorRecord): ErrorDetail {
  return {
    id: record.errorId ?? record.id ?? '-',
    message: record.message ?? 'unknown error',
    fileName: record.fileName ?? '-',
    timestamp: record.occurredAt ?? record.timestamp ?? '-',
    type: record.type ?? 'UNKNOWN_ERROR',
    filePath: record.filePath ?? undefined,
    pageNumber: record.pageNumber ?? record.page ?? undefined,
    model: record.model ?? undefined,
    stackTrace:
      record.raw == null ? undefined : JSON.stringify(record.raw, null, 2),
  }
}

export function useErrors(params: UseErrorsParams = {}, enabled = true) {
  return useQuery<ErrorsResponse>({
    queryKey: ['errors', params],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<BackendErrorsResponse>(
        '/monitoring/errors',
        { params },
      )
      return {
        ...data,
        items: data.items.map(mapErrorRecord),
      }
    },
  })
}

export function useErrorSummary(enabled = true) {
  return useQuery<ErrorSummaryResponse>({
    queryKey: ['errors', 'summary'],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<BackendErrorSummaryResponse>(
        '/monitoring/errors/summary',
      )
      return {
        totalErrors: data.totalErrors,
        byType: data.byType,
        recent: data.recent.map(mapErrorRecord),
      }
    },
  })
}
