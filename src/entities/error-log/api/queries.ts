import { useQuery } from '@tanstack/react-query'

import { api } from '@/shared/api'
import type { ErrorDetail } from '@/shared/types'

interface UseErrorsParams {
  search?: string
  type?: string
  page?: number
}

interface ErrorsResponse {
  items: ErrorDetail[]
  total: number
  page: number
  totalPages: number
}

export function useErrors(params: UseErrorsParams = {}) {
  return useQuery<ErrorsResponse>({
    queryKey: ['errors', params],
    queryFn: async () => {
      const { data } = await api.get<ErrorsResponse>('/errors', { params })
      return data
    },
  })
}
