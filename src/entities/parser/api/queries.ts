import { useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  cancelJob,
  connectJobProgressSocket,
  convertDocuments,
  getJobStatus,
  getJobItems,
  type ConvertParams,
} from '@/shared/api'
import type {
  ConvertResult,
  DocumentItem,
  DocumentStatus,
  JobItemsData,
  JobProgressEvent,
  JobStatus,
  JobStatusData,
} from '@/shared/types'

const TERMINAL_JOB_STATUSES = new Set([
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'CANCELED',
])
const JOB_STATUSES = new Set([
  'QUEUED',
  'PROCESSING',
  'CANCELLING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'CANCELED',
])

function clampPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return undefined
  return Math.min(100, Math.max(0, Math.floor(value)))
}

function isDocumentStatus(status: unknown): status is DocumentStatus {
  return (
    typeof status === 'string' &&
    [
      'UPLOADED',
      'QUEUED',
      'PROCESSING',
      'PREPROCESSING',
      'GPU_WAITING',
      'GPU_PROCESSING',
      'POSTPROCESSING',
      'COMPLETED',
      'FAILED',
      'CANCELLED',
      'CANCELED',
    ].includes(status)
  )
}

function isJobStatus(status: unknown): status is JobStatus {
  return typeof status === 'string' && JOB_STATUSES.has(status)
}

function applyProgressToCaches(
  event: JobProgressEvent,
  queryClient: ReturnType<typeof useQueryClient>,
) {
  const eventJobId = event.jobId
  const documentPercent = clampPercent(
    event.documentPercent ?? event.progressPercent ?? event.percent,
  )
  const jobPercent = clampPercent(event.jobPercent ?? event.percent)

  if (eventJobId) {
    queryClient.setQueryData<JobStatusData>(
      ['jobs', eventJobId],
      (previous) => {
        if (!previous) return previous
        return {
          ...previous,
          status: isJobStatus(event.status) ? event.status : previous.status,
          progressPercent: jobPercent ?? previous.progressPercent,
          totalItems: event.totalItems ?? previous.totalItems,
          completedItems: event.completedItems ?? previous.completedItems,
          failedItems: event.failedItems ?? previous.failedItems,
          canceledItems: event.canceledItems ?? previous.canceledItems,
          totalDocuments: event.totalDocuments ?? previous.totalDocuments,
          completedDocuments:
            event.completedDocuments ?? previous.completedDocuments,
          failedDocuments: event.failedDocuments ?? previous.failedDocuments,
          canceledDocuments:
            event.canceledDocuments ?? previous.canceledDocuments,
          updatedAt: event.timestamp ?? previous.updatedAt,
        }
      },
    )

    queryClient.setQueryData<JobItemsData>(
      ['jobs', eventJobId, 'items'],
      (previous) => {
        if (!previous?.items || !event.jobItemId) return previous
        return {
          ...previous,
          items: previous.items.map((item) =>
            item.jobItemId === event.jobItemId
              ? {
                  ...item,
                  status: isDocumentStatus(event.status)
                    ? event.status
                    : item.status,
                  progressPercent: documentPercent ?? item.progressPercent,
                  currentPage: event.currentPage ?? item.currentPage,
                  totalPages: event.totalPages ?? item.totalPages,
                }
              : item,
          ),
        }
      },
    )
  }

  if (event.documentId) {
    queryClient.setQueryData<{
      items: DocumentItem[]
      nextCursor: string | null
    }>(['documents'], (previous) => {
      if (!previous?.items) return previous
      return {
        ...previous,
        items: previous.items.map((item) =>
          item.documentId === event.documentId
            ? {
                ...item,
                latestStatus: isDocumentStatus(event.status)
                  ? event.status
                  : item.latestStatus,
                progressPercent: documentPercent ?? item.progressPercent,
                currentPage: event.currentPage ?? item.currentPage,
                totalPages: event.totalPages ?? item.totalPages,
              }
            : item,
        ),
      }
    })
  }

  if (
    eventJobId &&
    typeof event.status === 'string' &&
    TERMINAL_JOB_STATUSES.has(event.status)
  ) {
    void queryClient.invalidateQueries({ queryKey: ['documents'] })
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }
}

export function useConvertDocuments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: ConvertParams) => {
      const { data } = await convertDocuments(params)
      return data as ConvertResult
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useJobStatus(jobId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['jobs', jobId],
    queryFn: async () => {
      const { data } = await getJobStatus(jobId!)
      return data as JobStatusData
    },
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (
        status === 'COMPLETED' ||
        status === 'FAILED' ||
        status === 'CANCELED'
      ) {
        return false
      }
      return 2000 // 진행 중이면 2초마다 폴링
    },
  })
}

export function useJobItems(jobId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['jobs', jobId, 'items'],
    queryFn: async () => {
      const { data } = await getJobItems(jobId!)
      return data as JobItemsData
    },
    enabled: !!jobId && enabled,
    refetchInterval: 2000,
  })
}

export function useCancelJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      jobId,
      force = false,
    }: {
      jobId: string
      force?: boolean
    }) => {
      const { data } = await cancelJob(jobId, force)
      return data as JobStatusData
    },
    onSuccess: (_, { jobId }) => {
      void queryClient.invalidateQueries({ queryKey: ['jobs', jobId] })
      void queryClient.invalidateQueries({ queryKey: ['jobs', jobId, 'items'] })
    },
  })
}

export function useJobProgressStream(
  jobId: string | undefined,
  enabled = true,
  onProgress?: (event: JobProgressEvent) => void,
) {
  const queryClient = useQueryClient()
  const onProgressRef = useRef(onProgress)

  useEffect(() => {
    onProgressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    if (!enabled || !jobId) return

    let closed = false
    let retryTimer: number | undefined
    let socket: WebSocket | null = null

    const connect = () => {
      socket = connectJobProgressSocket({
        jobId,
        onMessage: (event) => {
          applyProgressToCaches(event, queryClient)
          onProgressRef.current?.(event)
        },
      })
      socket.onclose = () => {
        if (!closed) {
          retryTimer = window.setTimeout(connect, 1500)
        }
      }
    }

    connect()

    return () => {
      closed = true
      if (retryTimer) window.clearTimeout(retryTimer)
      socket?.close()
    }
  }, [enabled, jobId, queryClient])
}

export function useGlobalJobProgressStream(enabled = true) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return

    let closed = false
    let retryTimer: number | undefined
    let socket: WebSocket | null = null

    const connect = () => {
      socket = connectJobProgressSocket({
        onMessage: (event) => applyProgressToCaches(event, queryClient),
      })
      socket.onclose = () => {
        if (!closed) {
          retryTimer = window.setTimeout(connect, 1500)
        }
      }
    }

    connect()

    return () => {
      closed = true
      if (retryTimer) window.clearTimeout(retryTimer)
      socket?.close()
    }
  }, [enabled, queryClient])
}
