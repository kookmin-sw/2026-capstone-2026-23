import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  type CreateRagSessionParams,
  createRagSession,
  deleteRagSession,
  getRagMessages,
  getRagSessions,
  sendRagMessage,
} from '@/shared/api'
import type { RagAnswer, RagMessage, RagSession } from '@/shared/types'

export function useRagSessions() {
  return useQuery({
    queryKey: ['rag', 'sessions'],
    queryFn: async () => {
      const { data } = await getRagSessions()
      return data as { items: RagSession[] }
    },
  })
}

export function useRagMessages(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['rag', 'sessions', sessionId, 'messages'],
    queryFn: async () => {
      const { data } = await getRagMessages(sessionId!)
      return data as { items: RagMessage[]; nextCursor: string | null }
    },
    enabled: !!sessionId,
  })
}

export function useCreateRagSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      title,
      documentIds,
      documentPaths,
    }: CreateRagSessionParams) => {
      const { data } = await createRagSession({
        title,
        documentIds,
        documentPaths,
      })
      return data as RagSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rag', 'sessions'] })
    },
  })
}

export function useSendRagMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      content,
      topK,
    }: {
      sessionId: string
      content: string
      topK?: number
    }) => {
      const { data } = await sendRagMessage(sessionId, content, topK)
      return data as RagAnswer
    },
    onSuccess: (_, { sessionId }) => {
      void queryClient.invalidateQueries({
        queryKey: ['rag', 'sessions', sessionId, 'messages'],
      })
    },
  })
}

export function useDeleteRagSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      await deleteRagSession(sessionId)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rag', 'sessions'] })
    },
  })
}
