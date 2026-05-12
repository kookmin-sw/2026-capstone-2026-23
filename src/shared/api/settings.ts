import { api } from './client'

import type { StorageSettings } from '@/shared/types'

// GET /admin/storage
export const getStorageSettings = () => api.get<StorageSettings>('/admin/storage')

// PUT /admin/storage
export const updateStorageSettings = (storagePath: string) =>
  api.put<StorageSettings>('/admin/storage', { storagePath })
