import { useEffect } from 'react'
import { Info, CheckCircle, AlertTriangle } from 'lucide-react'
import {
  FileUploader,
  ConversionSettings,
  ActionButtons,
  UploadedFilesList,
  useUploadStore,
} from '@/features/file-upload'
import {
  useConvertDocuments,
  useJobStatus,
  useCancelJob,
} from '@/entities/parser'

export function ConversionPanel() {
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

  const convertMutation = useConvertDocuments()
  const cancelMutation = useCancelJob()
  const { data: jobData } = useJobStatus(jobId ?? undefined, isConverting)

  // Job 상태 폴링으로 파일 상태 업데이트
  useEffect(() => {
    if (!jobData) return

    const { status, completedDocuments, totalDocuments, failedDocuments } =
      jobData
    const progress =
      totalDocuments > 0
        ? Math.floor(
            ((completedDocuments + failedDocuments) / totalDocuments) * 100,
          )
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
            updateFile(f.id, { status: 'completed', progress: 100 })
          }
        })
      } else if (status === 'CANCELED') {
        setBatchStatus('변환이 취소되었습니다.')
      } else {
        setBatchStatus(`변환 실패: ${failedDocuments}건 실패`)
      }
    } else {
      // 진행 중 — 각 파일의 progress 업데이트
      files.forEach((f) => {
        if (f.status === 'pending' || f.status === 'converting') {
          updateFile(f.id, { status: 'converting', progress })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to jobData changes, store setters are stable
  }, [jobData])

  const completedCount = files.filter((f) => f.status === 'completed').length
  const totalCount = files.length
  const overallProgress =
    totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0

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
      const result = await convertMutation.mutateAsync({
        files: files.map((f) => f.file),
        modelId,
        parallelism: parallelCount,
        duplicatePolicy: overwriteMode,
      })

      setJobId(result.jobId)

      // 변환 결과의 documentId를 파일에 매핑
      result.items.forEach((item, index) => {
        if (files[index]) {
          updateFile(files[index].id, { documentId: item.documentId })
        }
      })
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
      await cancelMutation.mutateAsync(jobId)
      setBatchStatus('중지 요청이 반영되었습니다.')
    } catch {
      setBatchStatus('중지 요청 실패')
    }
  }

  const handleResume = () => {
    // 재개는 새 변환 요청으로 처리
    handleConvert()
  }

  // BatchStatus inline
  const renderBatchStatus = () => {
    if (!batchStatus) return null
    const isSuccess =
      batchStatus.includes('완료') && !batchStatus.includes('실패')
    const isWarning =
      batchStatus.includes('중지') || batchStatus.includes('취소')
    const isError = batchStatus.includes('실패') || batchStatus.includes('오류')

    const bgColor = isSuccess
      ? 'bg-[#defbe6] border-[#24a148]'
      : isWarning
        ? 'bg-[#fddc69]/30 border-[#f1c21b]'
        : isError
          ? 'bg-[#fff1f1] border-[#da1e28]'
          : 'bg-accent border-primary'
    const textColor = isSuccess
      ? 'text-[#198038]'
      : isWarning
        ? 'text-[#684e00]'
        : isError
          ? 'text-destructive'
          : 'text-primary'
    const Icon = isSuccess
      ? CheckCircle
      : isWarning || isError
        ? AlertTriangle
        : Info
    const iconColor = isSuccess
      ? 'text-[#24a148]'
      : isWarning
        ? 'text-[#f1c21b]'
        : isError
          ? 'text-destructive'
          : 'text-primary'

    return (
      <div>
        <label className="text-foreground mb-2 block text-sm font-medium">
          배치 상태
        </label>
        <div className={`border px-4 py-3 ${bgColor}`}>
          <div className="flex items-start gap-3">
            <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} />
            <p className={`flex-1 text-sm whitespace-pre-line ${textColor}`}>
              {batchStatus}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <FileUploader onFilesAdded={addFiles} />

      {files.length > 0 && (
        <UploadedFilesList
          files={files}
          onRemoveFile={removeFile}
          onFileSelect={handleFileSelect}
          selectedFileId={selectedFile?.id}
          overallProgress={overallProgress}
        />
      )}

      <ConversionSettings
        modelId={modelId}
        onModelIdChange={setModelId}
        parallelCount={parallelCount}
        onParallelCountChange={setParallelCount}
        isPreferredModel={isPreferredModel}
        onPreferredModelChange={setIsPreferredModel}
        overwriteMode={overwriteMode}
        onOverwriteModeChange={setOverwriteMode}
      />

      <ActionButtons
        onConvert={handleConvert}
        onStop={handleStop}
        onResume={handleResume}
        isConverting={isConverting}
        hasFiles={files.length > 0}
      />

      {renderBatchStatus()}
    </div>
  )
}
