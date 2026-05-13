import { api } from './client'

import type { RagAnswer, RagMessage, RagSession } from '@/shared/types'

export interface CreateRagSessionParams {
  title: string
  documentIds?: string[]
  documentPaths?: string[]
}

// 세션 생성 (POST /rag/sessions)
export const createRagSession = ({
  title,
  documentIds = [],
  documentPaths = [],
}: CreateRagSessionParams) =>
  api.post<RagSession>('/rag/sessions', { title, documentIds, documentPaths })

// 세션 목록 (GET /rag/sessions)
export const getRagSessions = () =>
  api.get<{ items: RagSession[] }>('/rag/sessions')

// 세션 상세 (GET /rag/sessions/{sessionId})
export const getRagSession = (sessionId: string) =>
  api.get<RagSession>(`/rag/sessions/${sessionId}`)

// 메시지 목록 (GET /rag/sessions/{sessionId}/messages)
export const getRagMessages = (sessionId: string) =>
  api.get<{ items: RagMessage[]; nextCursor: string | null }>(
    `/rag/sessions/${sessionId}/messages`,
  )

// 메시지 전송 (POST /rag/sessions/{sessionId}/messages)
export const sendRagMessage = (sessionId: string, content: string, topK = 3) =>
  api.post<RagAnswer>(
    `/rag/sessions/${sessionId}/messages`,
    {
      content,
      topK,
    },
    { timeout: 180000 },
  )

// 세션 삭제 (DELETE /rag/sessions/{sessionId})
export const deleteRagSession = (sessionId: string) =>
  api.delete(`/rag/sessions/${sessionId}`)
