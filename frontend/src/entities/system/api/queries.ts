import { useQuery } from '@tanstack/react-query'

import {
  getDashboardFileTypes,
  getDashboardRecentItems,
  getDashboardSummary,
  getSystemMonitoring,
} from '@/shared/api'
import type {
  DashboardSummary,
  DocumentItem,
  SystemMonitoring,
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
      return data as { from: string | null; to: string | null; types: string[] }
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

export function useSystemMonitoring(enabled = true) {
  return useQuery({
    queryKey: ['monitoring', 'system'],
    enabled,
    refetchInterval: 5000,
    queryFn: async () => {
      const { data } = await getSystemMonitoring()
      return data as SystemMonitoring
    },
  })
}
