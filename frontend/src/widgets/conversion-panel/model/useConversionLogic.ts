import { useCallback, useEffect, useRef } from 'react'
import { useUploadStore } from '@/features/file-upload'
import {
  useConvertDocuments,
  useJobStatus,
  useJobItems,
  useCancelJob,
  useJobProgressStream,
} from '@/entities/parser'
import { useUIStore } from '@/app/model/ui-store'
import type { JobProgressEvent } from '@/shared/types'

const TERMINAL_STATUSES = new Set([
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'CANCELED',
])

function clampPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, Math.floor(value)))
}

export function useConversionLogic() {
  const {
    files,
    modelId,
    parallelCount,
    isConverting,
    batchStatus,
    selectedResultPath,
    isPreferredModel,
    overwriteMode,
    jobId,
    addFiles,
    removeFile,
    updateFile,
    setModelId,
    setParallelCount,
    setIsConverting,
    setBatchStatus,
    setSelectedResultPath,
    setIsPreferredModel,
    setOverwriteMode,
    setJobId,
  } = useUploadStore()

  const { isMockMode, setIsMockMode } = useUIStore()

  const convertMutation = useConvertDocuments()
  const cancelMutation = useCancelJob()
  const { data: jobData } = useJobStatus(jobId ?? undefined, isConverting)
  const { data: jobItemsData } = useJobItems(jobId ?? undefined, isConverting)
  const itemsMappedRef = useRef(false)

  const handleProgressEvent = useCallback(
    (event: JobProgressEvent) => {
      if (!event.documentId) {
        if (event.jobPercent != null) {
          setBatchStatus(`처리 중: ${clampPercent(event.jobPercent)}%`)
        }
        if (event.status && TERMINAL_STATUSES.has(event.status)) {
          setIsConverting(false)
        }
        return
      }

      const currentFiles = useUploadStore.getState().files
      const target = currentFiles.find(
        (file) => file.documentId === event.documentId,
      )
      if (!target) return

      const progress = clampPercent(
        event.documentPercent ?? event.progressPercent ?? event.percent,
      )
      const nextProgress =
        event.status === 'COMPLETED'
          ? 100
          : Math.max(target.progress ?? 0, progress)

      if (event.status === 'COMPLETED') {
        updateFile(target.id, {
          status: 'completed',
          progress: 100,
          resultPath: event.documentId,
          currentPage: event.currentPage ?? target.currentPage,
          totalPages: event.totalPages ?? target.totalPages,
        })
        if (!selectedResultPath) {
          setSelectedResultPath(event.documentId)
        }
        return
      }

      if (event.status === 'FAILED') {
        updateFile(target.id, {
          status: 'failed',
          progress: nextProgress,
          error: event.error?.message ?? '변환 실패',
        })
        return
      }

      if (event.status === 'CANCELLED' || event.status === 'CANCELED') {
        updateFile(target.id, {
          status: 'failed',
          progress: nextProgress,
          error: '변환 취소',
        })
        return
      }

      updateFile(target.id, {
        status: 'converting',
        progress: nextProgress,
        currentPage: event.currentPage ?? target.currentPage,
        totalPages: event.totalPages ?? target.totalPages,
      })

      if (event.jobPercent != null) {
        setBatchStatus(`처리 중: ${clampPercent(event.jobPercent)}%`)
      }
    },
    [
      selectedResultPath,
      setBatchStatus,
      setIsConverting,
      setSelectedResultPath,
      updateFile,
    ],
  )

  useJobProgressStream(jobId ?? undefined, isConverting, handleProgressEvent)

  // Job items에서 documentId 매핑 (한 번만 실행)
  useEffect(() => {
    if (!jobItemsData?.items || itemsMappedRef.current) return
    const jobItems = jobItemsData.items
    if (jobItems.length === 0) return

    jobItems.forEach((item, index) => {
      if (files[index] && item.documentId) {
        updateFile(files[index].id, { documentId: item.documentId })
      }
    })
    itemsMappedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to jobItemsData
  }, [jobItemsData])

  // Job 상태 폴링으로 파일 상태 업데이트
  useEffect(() => {
    if (!jobData) return

    const { status } = jobData
    const totalDocuments = jobData.totalItems ?? jobData.totalDocuments ?? 0
    const completedDocuments =
      jobData.completedItems ?? jobData.completedDocuments ?? 0
    const failedDocuments = jobData.failedItems ?? jobData.failedDocuments ?? 0
    if (totalDocuments <= 0) return

    const finishedDocuments = completedDocuments + failedDocuments
    const progress =
      totalDocuments > 0
        ? Math.floor((finishedDocuments / totalDocuments) * 100)
        : 0

    setBatchStatus(
      `처리 중: ${completedDocuments}/${totalDocuments} 완료${failedDocuments > 0 ? `, ${failedDocuments}건 실패` : ''}`,
    )

    // 터미널 상태 도달 시
    if (
      status === 'COMPLETED' ||
      status === 'FAILED' ||
      status === 'CANCELED'
    ) {
      setIsConverting(false)
      if (status === 'COMPLETED') {
        setBatchStatus(
          `변환 완료: ${completedDocuments}/${totalDocuments}건 성공`,
        )
        files.forEach((f) => {
          if (f.status === 'converting') {
            const resultPath = f.documentId ?? f.id
            updateFile(f.id, {
              status: 'completed',
              progress: 100,
              resultPath,
            })
          }
        })
        // 첫 번째 완료 파일 자동 선택
        const firstCompleted = files.find(
          (f) => f.status === 'converting' && f.documentId,
        )
        if (firstCompleted?.documentId) {
          setSelectedResultPath(firstCompleted.documentId)
        }
      } else if (status === 'CANCELED') {
        setBatchStatus('변환이 취소되었습니다.')
      } else {
        setBatchStatus(`변환 실패: ${failedDocuments}건 실패`)
      }
    } else {
      // 진행 중 — 각 파일의 progress 업데이트
      files.forEach((f) => {
        if (f.status === 'pending' || f.status === 'converting') {
          updateFile(f.id, {
            status: 'converting',
            progress: Math.max(f.progress ?? 0, progress),
          })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to jobData changes, store setters are stable
  }, [jobData])

  const completedCount = files.filter((f) => f.status === 'completed').length
  const totalCount = files.length
  const overallProgress =
    totalCount > 0
      ? Math.floor(
          files.reduce(
            (sum, file) =>
              sum + (file.status === 'completed' ? 100 : (file.progress ?? 0)),
            0,
          ) / totalCount,
        )
      : 0

  const selectedFile = files.find((f) => f.resultPath === selectedResultPath)

  const handleFileSelect = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file?.status === 'completed' && file.resultPath) {
      setSelectedResultPath(file.resultPath)
    }
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    setIsConverting(true)
    setBatchStatus(`${files.length}개 파일 변환을 시작합니다...`)

    files.forEach((f) => {
      updateFile(f.id, { status: 'converting', progress: 0 })
    })

    try {
      itemsMappedRef.current = false
      const result = await convertMutation.mutateAsync({
        files: files.map((f) => f.file),
        modelId,
        parallelism: parallelCount,
      })

      setJobId(result.jobId)
      // documentId 매핑은 useJobItems 폴링에서 처리
    } catch (error) {
      setIsConverting(false)
      const message = error instanceof Error ? error.message : '변환 요청 실패'
      setBatchStatus(`오류: ${message}`)
      files.forEach((f) => {
        updateFile(f.id, { status: 'failed', error: message })
      })
    }
  }

  const handleStop = async () => {
    if (!jobId) return
    try {
      await cancelMutation.mutateAsync({ jobId })
      setBatchStatus('중지 요청이 반영되었습니다.')
    } catch {
      setBatchStatus('중지 요청 실패')
    }
  }

  const handleForceStop = async () => {
    if (!jobId) return
    try {
      await cancelMutation.mutateAsync({ jobId, force: true })
      setBatchStatus('강제 취소 요청이 반영되었습니다.')
    } catch {
      setBatchStatus('강제 취소 요청 실패')
    }
  }

  const handleResume = () => {
    handleConvert()
  }

  // BatchStatus 판별 helpers
  const batchStatusType = (() => {
    if (!batchStatus) return null
    const isSuccess =
      batchStatus.includes('완료') && !batchStatus.includes('실패')
    const isWarning =
      batchStatus.includes('중지') || batchStatus.includes('취소')
    const isError = batchStatus.includes('실패') || batchStatus.includes('오류')
    if (isSuccess) return 'success' as const
    if (isWarning) return 'warning' as const
    if (isError) return 'error' as const
    return 'info' as const
  })()

  return {
    // state
    files,
    modelId,
    parallelCount,
    isConverting,
    batchStatus,
    batchStatusType,
    selectedResultPath,
    isPreferredModel,
    overwriteMode,
    isMockMode,
    selectedFile,
    completedCount,
    totalCount,
    overallProgress,
    hasFiles: files.length > 0,
    // actions
    addFiles,
    removeFile,
    handleFileSelect,
    handleConvert,
    handleStop,
    handleForceStop,
    handleResume,
    setModelId,
    setParallelCount,
    setIsPreferredModel,
    setOverwriteMode,
    setIsMockMode,
    setSelectedResultPath,
  }
}
