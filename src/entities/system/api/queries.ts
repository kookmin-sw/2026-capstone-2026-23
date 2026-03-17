import { useQuery } from '@tanstack/react-query'

import {
  getDashboardFileTypes,
  getDashboardRecentItems,
  getDashboardSummary,
} from '@/shared/api'
import type {
  DashboardFileType,
  DashboardSummary,
  DocumentItem,
} from '@/shared/types'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await getDashboardSummary()
      return data as DashboardSummary
    },
  })
}

export function useDashboardFileTypes() {
  return useQuery({
    queryKey: ['dashboard', 'file-types'],
    queryFn: async () => {
      const { data } = await getDashboardFileTypes()
      return data as { items: DashboardFileType[] }
    },
  })
}

export function useDashboardRecentItems(limit = 10) {
  return useQuery({
    queryKey: ['dashboard', 'recent-items', limit],
    queryFn: async () => {
      const { data } = await getDashboardRecentItems(limit)
      return data as { items: DocumentItem[]; nextCursor: string | null }
    },
  })
}
