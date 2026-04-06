import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  cancelJob,
  convertDocuments,
  getJobStatus,
  getJobItems,
  type ConvertParams,
} from '@/shared/api'
import type { ConvertResult, JobStatusData, JobItemsData } from '@/shared/types'

export function useConvertDocuments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: ConvertParams) => {
      const { data } = await convertDocuments(params)
      return data as ConvertResult
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useJobStatus(jobId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['jobs', jobId],
    queryFn: async () => {
      const { data } = await getJobStatus(jobId!)
      return data as JobStatusData
    },
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (
        status === 'COMPLETED' ||
        status === 'FAILED' ||
        status === 'CANCELED'
      ) {
        return false
      }
      return 2000 // 진행 중이면 2초마다 폴링
    },
  })
}

export function useJobItems(jobId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['jobs', jobId, 'items'],
    queryFn: async () => {
      const { data } = await getJobItems(jobId!)
      return data as JobItemsData
    },
    enabled: !!jobId && enabled,
    staleTime: 5000,
  })
}

export function useCancelJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await cancelJob(jobId)
      return data as JobStatusData
    },
    onSuccess: (_, jobId) => {
      void queryClient.invalidateQueries({ queryKey: ['jobs', jobId] })
    },
  })
}
