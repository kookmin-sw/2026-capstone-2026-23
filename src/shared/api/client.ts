import axios from 'axios'
import { toast } from 'sonner'

import type { ApiError, ApiResponse } from '@/shared/types'

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
        const apiError = body.error as ApiError
        toast.error(apiError.message || '요청 처리에 실패했습니다.')
        return Promise.reject(apiError)
      }
      response.data = body.data
    }
    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        toast.error('요청 시간이 초과되었습니다.')
      } else if (!error.response) {
        toast.error('서버에 연결할 수 없습니다. 백엔드 서버를 확인해주세요.')
      } else {
        const status = error.response.status
        const messages: Record<number, string> = {
          400: '잘못된 요청입니다.',
          401: '인증이 필요합니다.',
          403: '접근 권한이 없습니다.',
          404: '요청한 리소스를 찾을 수 없습니다.',
          422: '입력 데이터가 올바르지 않습니다.',
          500: '서버 내부 오류가 발생했습니다.',
        }
        toast.error(messages[status] || `오류가 발생했습니다. (${status})`)
      }
    }
    return Promise.reject(error)
  },
)
