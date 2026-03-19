import { useQuery } from '@tanstack/react-query'

import { getModels } from '@/shared/api'
import type { VlmModel } from '@/shared/types'

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const { data } = await getModels()
      return data as { models: VlmModel[] }
    },
    staleTime: 5 * 60 * 1000, // 모델 목록은 자주 안 바뀜
  })
}
