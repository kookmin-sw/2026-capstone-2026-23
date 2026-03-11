import { useQuery } from '@tanstack/react-query'

import { api } from '@/shared/api'
import type { DashboardStats, DateFilter, SystemStats } from '@/shared/types'

export function useSystemStats() {
  return useQuery<SystemStats>({
    queryKey: ['system', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<SystemStats>('/system/stats')
      return data
    },
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  })
}

export function useDashboardStats(filter: DateFilter) {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats', filter],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/dashboard/stats', {
        params: filter,
      })
      return data
    },
  })
}
