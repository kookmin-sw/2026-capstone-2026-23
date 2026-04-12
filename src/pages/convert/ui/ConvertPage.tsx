import { useState, useRef } from 'react'
import {
  Info,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  Upload,
  FolderOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useConversionLogic } from '@/widgets/conversion-panel'
import { DocumentViewer } from '@/widgets/document-viewer'
import { ChatModal } from '@/widgets/chat-modal'
import { FloatingControlPanel } from '@/widgets/floating-control-panel'
import { useUploadStore } from '@/features/file-upload'
import { useUIStore } from '@/app/model/ui-store'
import { useDocumentResult } from '@/entities/document'
import { MOCK_DOCUMENT_RESULT } from '@/shared/lib/mock-document-result'

// ── Batch Status Banner ──

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

// ── Empty State ──

const ACCEPTED_EXTENSIONS = '.hwp,.hwpx,.pdf,.png,.jpg,.jpeg,.bmp,.tiff'

const WORKFLOW_STEPS = [
  {
    icon: Upload,
    title: '문서 업로드',
    description: 'HWP, PDF, 이미지 등\n문서를 올려주세요',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Sparkles,
    title: 'AI 변환',
    description: 'VLM이 표, 이미지, 텍스트를\n구조화된 형태로 추출합니다',
    color: 'text-[#8a3ffc] bg-[#8a3ffc]/10',
  },
  {
    icon: MessageCircle,
    title: '결과 확인',
    description: '변환 결과를 미리보고\nAI 챗봇에게 질문해보세요',
    color: 'text-[#198038] bg-[#198038]/10',
  },
] as const

function EmptyState({
  onFilesAdded,
}: {
  onFilesAdded?: (files: File[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 p-8">
      {/* Workflow steps */}
      <div className="flex items-start gap-4">
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={step.title} className="flex items-start gap-4">
            <div className="flex w-[160px] flex-col items-center text-center">
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}
              >
                <step.icon className="h-6 w-6" />
              </div>
              <p className="text-foreground mb-1 text-sm font-semibold">
                {step.title}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
                {step.description}
              </p>
            </div>
            {i < WORKFLOW_STEPS.length - 1 && (
              <ArrowRight className="text-border mt-4 h-5 w-5 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Upload buttons */}
      {onFilesAdded && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-border hover:border-primary/40 hover:text-primary text-foreground flex items-center gap-2 rounded-lg border bg-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <Upload className="h-4 w-4" />
              파일 선택
            </button>
            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="border-border hover:border-primary/40 hover:text-primary text-foreground flex items-center gap-2 rounded-lg border bg-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              폴더 선택
            </button>
          </div>
          <p className="text-muted-foreground/60 text-xs">
            또는 이 화면에 파일을 드래그하여 업로드
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_EXTENSIONS}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) onFilesAdded(Array.from(e.target.files))
              e.target.value = ''
            }}
          />
          <input
            ref={folderInputRef}
            type="file"
            // @ts-expect-error webkitdirectory is valid but not in TS types
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) onFilesAdded(Array.from(e.target.files))
              e.target.value = ''
            }}
          />
        </div>
      )}
    </div>
  )
}

// ── Main Page ──

export function ConvertPage() {
  const { selectedResultPath, files } = useUploadStore()
  const { isChatOpen, setIsChatOpen, isMockMode } = useUIStore()
  const logic = useConversionLogic()
  const [isDragging, setIsDragging] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const addFiles = (newFiles: File[]) => {
    logic.addFiles(newFiles)
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

  const hasResult = !!displayFile

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
        addFiles(droppedFiles)
      }
    }

    processItems()
  }

  return (
    <>
      {/* 전체 레이아웃: main 패딩을 뚫고 나가서 우측 사이드바를 최상위처럼 배치 */}
      <div
        className="-my-5 -mr-4 flex h-dvh"
        style={
          {
            '--convert-sidebar-w': isSidebarOpen ? '280px' : '44px',
          } as React.CSSProperties
        }
      >
        {/* 메인 콘텐츠 영역 (패딩 복원) */}
        <div className="flex flex-1 flex-col py-5 pr-4 pl-0">
          <div
            className={`relative flex flex-1 flex-col overflow-hidden rounded-2xl transition-all ${
              isDragging ? 'ring-primary ring-2 ring-inset' : ''
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

            {hasResult ? (
              <DocumentViewer
                documentResult={displayResult}
                isLoading={displayLoading}
                originalFile={selectedFile?.file ?? null}
                className="h-full"
              />
            ) : (
              <div className="bg-card flex h-full flex-col rounded-2xl">
                <EmptyState onFilesAdded={addFiles} />
              </div>
            )}
          </div>
        </div>

        {/* 우측 사이드바 — main 패딩 바깥, 화면 끝까지 full height */}
        <FloatingControlPanel
          files={logic.files}
          onRemoveFile={logic.removeFile}
          onFileSelect={logic.handleFileSelect}
          onFilesAdded={addFiles}
          expanded={isSidebarOpen}
          onExpandedChange={setIsSidebarOpen}
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
      </div>

      {/* Chat — 우측 사이드바 왼쪽에 위치 */}
      <div
        className="pointer-events-none fixed bottom-0 z-50"
        style={{ right: 'calc(var(--convert-sidebar-w, 280px) + 0.75rem)' }}
      >
        {displayFile && !isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-primary hover:bg-primary/85 pointer-events-auto mb-3 rounded-full p-4 text-white shadow-2xl transition-all hover:scale-110"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        )}

        <div className="pointer-events-auto">
          <ChatModal
            variant="embedded"
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            selectedFile={selectedResultPath}
          />
        </div>
      </div>
    </>
  )
}
