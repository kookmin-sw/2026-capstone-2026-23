import axios from 'axios'

import type { ApiResponse } from '@/shared/types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => {
    // 백엔드 { success, data, error } 래퍼 자동 unwrap
    const body = response.data as ApiResponse<unknown>
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success && body.error) {
        return Promise.reject(body.error)
      }
      response.data = body.data
    }
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  },
)
