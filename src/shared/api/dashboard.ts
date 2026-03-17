import { api } from './client'

import type {
  DashboardFileType,
  DashboardSummary,
  DocumentItem,
} from '@/shared/types'

// 대시보드 요약 (GET /dashboard/summary)
export const getDashboardSummary = () =>
  api.get<DashboardSummary>('/dashboard/summary')

// 파일 타입 통계 (GET /dashboard/file-types)
export const getDashboardFileTypes = () =>
  api.get<{ items: DashboardFileType[] }>('/dashboard/file-types')

// 최근 문서 (GET /dashboard/recent-items)
export const getDashboardRecentItems = (limit = 10) =>
  api.get<{ items: DocumentItem[]; nextCursor: string | null }>(
    '/dashboard/recent-items',
    { params: { limit } },
  )
