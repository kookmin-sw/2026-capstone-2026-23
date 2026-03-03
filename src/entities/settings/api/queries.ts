import { useMutation } from '@tanstack/react-query'

import { api } from '@/shared/api'

export function useConvertFiles() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post<{ outputPath: string }>(
        '/process/file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return data
    },
  })
}
