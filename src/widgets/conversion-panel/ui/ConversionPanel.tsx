import { Info, CheckCircle, AlertTriangle } from 'lucide-react'
import {
  FileUploader,
  ConversionSettings,
  ActionButtons,
  UploadedFilesList,
  useUploadStore,
} from '@/features/file-upload'

export function ConversionPanel() {
  const {
    files,
    vlmModel,
    parallelCount,
    isConverting,
    batchStatus,
    selectedResultPath,
    isPreferredModel,
    overwriteMode,
    addFiles,
    removeFile,
    updateFile,
    setVlmModel,
    setParallelCount,
    setIsConverting,
    setBatchStatus,
    setSelectedResultPath,
    setIsPreferredModel,
    setOverwriteMode,
  } = useUploadStore()

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

  const handleConvert = () => {
    setIsConverting(true)
    setBatchStatus(`${files.length}개 파일 변환을 시작합니다...`)

    files.forEach((uploadedFile, index) => {
      const delay = index * 2000
      setTimeout(() => {
        const totalPages = Math.floor(Math.random() * 50) + 10
        updateFile(uploadedFile.id, {
          status: 'converting',
          progress: 0,
          totalPages,
        })

        const pageInterval = 200
        let currentPage = 0
        const interval = setInterval(() => {
          currentPage++
          const progress = Math.floor((currentPage / totalPages) * 100)
          updateFile(uploadedFile.id, { progress, currentPage, totalPages })

          if (currentPage >= totalPages) {
            clearInterval(interval)
            const success = Math.random() > 0.1
            setTimeout(() => {
              const resultPath = `data/outputs/${uploadedFile.file.name.replace(/\.[^/.]+$/, '')}.txt`
              updateFile(uploadedFile.id, {
                status: success ? 'completed' : 'failed',
                progress: 100,
                resultPath: success ? resultPath : undefined,
                error: success ? undefined : 'VLM 응답 시간 초과',
              })
              if (success && index === 0) {
                setTimeout(() => setSelectedResultPath(resultPath), 500)
              }
              if (index === files.length - 1) {
                setTimeout(() => {
                  setIsConverting(false)
                  setBatchStatus(`변환 완료`)
                }, 500)
              }
            }, 300)
          }
        }, pageInterval)
      }, delay)
    })
  }

  const handleStop = () => {
    setBatchStatus('중지 요청이 반영되었습니다.')
    setIsConverting(false)
  }

  const handleResume = () => {
    setIsConverting(true)
    setBatchStatus('변환을 재개합니다...')
  }

  // BatchStatus inline
  const renderBatchStatus = () => {
    if (!batchStatus) return null
    const isSuccess =
      batchStatus.includes('완료') && !batchStatus.includes('실패')
    const isWarning = batchStatus.includes('중지')
    const isError =
      batchStatus.includes('실패') && !batchStatus.includes('성공')

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
        <label className="block text-sm font-medium text-foreground mb-2">
          배치 상태
        </label>
        <div className={`px-4 py-3 border ${bgColor}`}>
          <div className="flex items-start gap-3">
            <Icon
              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColor}`}
            />
            <p
              className={`text-sm whitespace-pre-line flex-1 ${textColor}`}
            >
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
        vlmModel={vlmModel}
        onVlmModelChange={setVlmModel}
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
