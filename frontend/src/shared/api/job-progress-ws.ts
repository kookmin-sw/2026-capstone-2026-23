import { TOKEN_KEY } from './client'
import type { ApiResponse, JobProgressEvent } from '@/shared/types'

interface JobProgressSocketOptions {
  jobId?: string
  onMessage: (event: JobProgressEvent) => void
  onError?: () => void
}

export function buildJobProgressWebSocketUrl(jobId?: string) {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
  const baseUrl = new URL(apiBase, window.location.origin)
  const normalizedPath = baseUrl.pathname.replace(/\/$/, '')
  baseUrl.pathname = `${normalizedPath}/ws/jobs`
  baseUrl.protocol = baseUrl.protocol === 'https:' ? 'wss:' : 'ws:'

  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    baseUrl.searchParams.set('accessToken', token)
  }
  if (jobId) {
    baseUrl.searchParams.set('jobId', jobId)
  }

  return baseUrl.toString()
}

export function connectJobProgressSocket({
  jobId,
  onMessage,
  onError,
}: JobProgressSocketOptions) {
  const socket = new WebSocket(buildJobProgressWebSocketUrl(jobId))

  socket.onmessage = (message) => {
    try {
      const payload = JSON.parse(message.data) as ApiResponse<JobProgressEvent>
      if (payload.success && payload.data?.type === 'job.item.progress') {
        onMessage(payload.data)
      }
    } catch {
      onError?.()
    }
  }

  socket.onerror = () => onError?.()

  return socket
}
