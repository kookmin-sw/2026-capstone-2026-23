import { api } from './client'

import type { VlmModel } from '@/shared/types'

// 모델 목록 (GET /models)
export const getModels = () => api.get<{ models: VlmModel[] }>('/models')
