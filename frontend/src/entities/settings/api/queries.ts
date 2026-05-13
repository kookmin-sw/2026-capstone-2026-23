import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getStorageSettings, updateStorageSettings } from '@/shared/api'
import type { StorageSettings } from '@/shared/types'

const storageSettingsKey = ['admin', 'storage'] as const

export function useStorageSettings(enabled = true) {
  return useQuery({
    queryKey: storageSettingsKey,
    enabled,
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data } = await getStorageSettings()
      return data as StorageSettings
    },
  })
}

export function useUpdateStorageSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ storagePath }: { storagePath: string }) => {
      const { data } = await updateStorageSettings(storagePath)
      return data as StorageSettings
    },
    onSuccess: (data) => {
      queryClient.setQueryData(storageSettingsKey, data)
      queryClient.invalidateQueries({ queryKey: storageSettingsKey })
      queryClient.invalidateQueries({ queryKey: ['monitoring', 'system'] })
    },
  })
}
