import { useState } from 'react'
import { Info, CheckCircle, AlertTriangle, MessageCircle } from 'lucide-react'
import { useConversionLogic } from '@/widgets/conversion-panel'
import { ResultsPanel } from '@/widgets/results-panel'
import { ChatModal } from '@/widgets/chat-modal'
import { FloatingControlPanel } from '@/widgets/floating-control-panel'
import { useUploadStore } from '@/features/file-upload'
import { useUIStore } from '@/app/model/ui-store'
import { useDocumentResult } from '@/entities/document'
import { MOCK_DOCUMENT_RESULT } from '@/shared/lib/mock-document-result'

function BatchStatusBanner({
  batchStatus,
  batchStatusType,
}: {
  batchStatus: string
  batchStatusType: 'success' | 'warning' | 'error' | 'info' | null
}) {
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

export function ConvertPage() {
  const { selectedResultPath, files, isMockMode } = useUploadStore()
  const { isChatOpen, setIsChatOpen } = useUIStore()
  const logic = useConversionLogic()
  const [isDragging, setIsDragging] = useState(false)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)

  const addFilesAndExpand = (newFiles: File[]) => {
    logic.addFiles(newFiles)
    setIsPanelExpanded(true)
  }

  const selectedFile = files.find((f) => f.resultPath === selectedResultPath)
  const { data: documentResult, isLoading: isResultLoading } =
    useDocumentResult(selectedFile?.documentId)

  const useMock = isMockMode && !selectedResultPath
  const displayFile = useMock ? 'mock' : selectedResultPath
  const displayResult = useMock ? MOCK_DOCUMENT_RESULT : documentResult
  const displayLoading = useMock
    ? false
    : isResultLoading && !!selectedFile?.documentId

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const items = Array.from(e.dataTransfer.items)
    const droppedFiles: File[] = []

    const processEntry = async (entry: FileSystemEntry): Promise<void> => {
      return new Promise((resolve) => {
        if (entry.isFile) {
          ;(entry as FileSystemFileEntry).file((file: File) => {
            droppedFiles.push(file)
            resolve()
          })
        } else if (entry.isDirectory) {
          const dirReader = (entry as FileSystemDirectoryEntry).createReader()
          dirReader.readEntries(async (entries) => {
            for (const childEntry of entries) {
              await processEntry(childEntry)
            }
            resolve()
          })
        } else {
          resolve()
        }
      })
    }

    const processItems = async () => {
      for (const item of items) {
        const entry = item.webkitGetAsEntry?.()
        if (entry) {
          await processEntry(entry)
        } else if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) droppedFiles.push(file)
        }
      }
      if (droppedFiles.length > 0) {
        addFilesAndExpand(droppedFiles)
      }
    }

    processItems()
  }

  return (
    <>
      {/* Full-width results — drag & drop zone */}
      <div
        className={`bg-card relative flex h-full flex-col overflow-hidden rounded-2xl transition-all ${
          isDragging ? 'ring-primary ring-2' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="bg-primary/5 absolute inset-0 z-10 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl">
                <svg
                  className="text-primary h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m0-16l-4 4m4-4l4 4"
                  />
                </svg>
              </div>
              <p className="text-primary text-sm font-semibold">
                여기에 파일을 놓으세요
              </p>
              <p className="text-primary/60 mt-1 text-xs">
                HWP, HWPX, PDF, PNG, JPG, BMP, TIFF
              </p>
            </div>
          </div>
        )}

        <ResultsPanel
          selectedFile={displayFile}
          documentResult={displayResult}
          isLoading={displayLoading}
          onFilesAdded={addFilesAndExpand}
        />
      </div>

      {/* Floating control panel (files + settings) */}
      <FloatingControlPanel
        files={logic.files}
        onRemoveFile={logic.removeFile}
        onFileSelect={logic.handleFileSelect}
        onFilesAdded={addFilesAndExpand}
        expanded={isPanelExpanded}
        onExpandedChange={setIsPanelExpanded}
        selectedFileId={logic.selectedFile?.id}
        overallProgress={logic.overallProgress}
        modelId={logic.modelId}
        onModelIdChange={logic.setModelId}
        parallelCount={logic.parallelCount}
        onParallelCountChange={logic.setParallelCount}
        isPreferredModel={logic.isPreferredModel}
        onPreferredModelChange={logic.setIsPreferredModel}
        overwriteMode={logic.overwriteMode}
        onOverwriteModeChange={logic.setOverwriteMode}
        isMockMode={logic.isMockMode}
        onMockModeChange={logic.setIsMockMode}
        onConvert={logic.handleConvert}
        onStop={logic.handleStop}
        onResume={logic.handleResume}
        isConverting={logic.isConverting}
        hasFiles={logic.hasFiles}
        batchStatusNode={
          <BatchStatusBanner
            batchStatus={logic.batchStatus}
            batchStatusType={logic.batchStatusType}
          />
        }
      />

      {/* Chat toggle button — icon only */}
      {displayFile && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-primary hover:bg-primary/85 fixed right-6 bottom-3 z-50 rounded-full p-4 text-white shadow-2xl transition-all hover:scale-110"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}

      <ChatModal
        variant="embedded"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedFile={selectedResultPath}
      />
    </>
  )
}
