import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/shared/api'
import type { DocumentItem } from '@/shared/types'

export function useDocuments() {
  return useQuery<DocumentItem[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await api.get<DocumentItem[]>('/documents')
      return data
    },
  })
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async ({
      id,
      type,
    }: {
      id: string
      type: 'original' | 'tmp' | 'output'
    }) => {
      const { data } = await api.post<Blob>(
        `/documents/${id}/download`,
        { type },
        { responseType: 'blob' },
      )
      return data
    },
  })
}

export function useDeleteFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      type,
    }: {
      id: string
      type: 'original' | 'tmp' | 'output'
    }) => {
      const { data } = await api.delete(`/documents/${id}`, {
        data: { type },
      })
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
