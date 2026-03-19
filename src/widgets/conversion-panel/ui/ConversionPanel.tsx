import { Info, CheckCircle, AlertTriangle, FlaskConical } from 'lucide-react'
import { Switch } from '@/shared/ui/switch'
import {
  FileUploader,
  ConversionSettings,
  ActionButtons,
  UploadedFilesList,
} from '@/features/file-upload'
import { useConversionLogic } from '../model/useConversionLogic'

export function ConversionPanel() {
  const {
    files,
    modelId,
    parallelCount,
    isConverting,
    batchStatus,
    batchStatusType,
    isPreferredModel,
    overwriteMode,
    isMockMode,
    selectedFile,
    overallProgress,
    hasFiles,
    addFiles,
    removeFile,
    handleFileSelect,
    handleConvert,
    handleStop,
    handleResume,
    setModelId,
    setParallelCount,
    setIsPreferredModel,
    setOverwriteMode,
    setIsMockMode,
  } = useConversionLogic()

  // BatchStatus inline
  const renderBatchStatus = () => {
    if (!batchStatus) return null

    const bgColor =
      batchStatusType === 'success'
        ? 'bg-[#defbe6] border-[#24a148]'
        : batchStatusType === 'warning'
          ? 'bg-[#fddc69]/30 border-[#f1c21b]'
          : batchStatusType === 'error'
            ? 'bg-[#fff1f1] border-[#da1e28]'
            : 'bg-accent border-primary'
    const textColor =
      batchStatusType === 'success'
        ? 'text-[#198038]'
        : batchStatusType === 'warning'
          ? 'text-[#684e00]'
          : batchStatusType === 'error'
            ? 'text-destructive'
            : 'text-primary'
    const Icon =
      batchStatusType === 'success'
        ? CheckCircle
        : batchStatusType === 'warning' || batchStatusType === 'error'
          ? AlertTriangle
          : Info
    const iconColor =
      batchStatusType === 'success'
        ? 'text-[#24a148]'
        : batchStatusType === 'warning'
          ? 'text-[#f1c21b]'
          : batchStatusType === 'error'
            ? 'text-destructive'
            : 'text-primary'

    return (
      <div className={`rounded-lg border px-3 py-2.5 ${bgColor}`}>
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 flex-shrink-0 ${iconColor}`} />
          <p className={`flex-1 text-xs whitespace-pre-line ${textColor}`}>
            {batchStatus}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top area — scrollable file content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {hasFiles ? (
          <UploadedFilesList
            files={files}
            onRemoveFile={removeFile}
            onFileSelect={handleFileSelect}
            onFilesAdded={addFiles}
            selectedFileId={selectedFile?.id}
            overallProgress={overallProgress}
          />
        ) : (
          <FileUploader onFilesAdded={addFiles} />
        )}
      </div>

      {/* Bottom — unified settings + action block */}
      <div className="border-border mt-4 shrink-0 border-t pt-4">
        {renderBatchStatus()}

        <div className="border-border mt-3 rounded-xl border p-4">
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

          <div className="mt-3">
            <ActionButtons
              onConvert={handleConvert}
              onStop={handleStop}
              onResume={handleResume}
              isConverting={isConverting}
              hasFiles={hasFiles}
            />
          </div>

          {/* Mock toggle */}
          <label className="text-muted-foreground mt-3 flex cursor-pointer items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <FlaskConical className="h-3.5 w-3.5" />
              목업 미리보기
            </span>
            <Switch checked={isMockMode} onCheckedChange={setIsMockMode} />
          </label>
        </div>
      </div>
    </div>
  )
}
