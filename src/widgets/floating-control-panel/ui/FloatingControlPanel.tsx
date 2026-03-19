import { useState } from 'react'
import { ChevronDown, FileText, Settings, FlaskConical } from 'lucide-react'
import { Switch } from '@/shared/ui/switch'
import {
  UploadedFilesList,
  ConversionSettings,
  ActionButtons,
  useUploadStore,
  type UploadFileItem,
} from '@/features/file-upload'

type Tab = 'files' | 'settings'

interface FloatingControlPanelProps {
  files: UploadFileItem[]
  onRemoveFile: (id: string) => void
  onFileSelect: (id: string) => void
  onFilesAdded: (files: File[]) => void
  selectedFileId?: string
  overallProgress: number
  // settings
  modelId: string
  onModelIdChange: (modelId: string) => void
  parallelCount: number
  onParallelCountChange: (count: number) => void
  isPreferredModel: boolean
  onPreferredModelChange: (isPreferred: boolean) => void
  overwriteMode: 'OVERWRITE' | 'KEEP_BOTH'
  onOverwriteModeChange: (mode: 'OVERWRITE' | 'KEEP_BOTH') => void
  isMockMode: boolean
  onMockModeChange: (mock: boolean) => void
  // actions
  onConvert: () => void
  onStop: () => void
  onResume: () => void
  isConverting: boolean
  hasFiles: boolean
  batchStatusNode?: React.ReactNode
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

export function FloatingControlPanel({
  files,
  onRemoveFile,
  onFileSelect,
  onFilesAdded,
  selectedFileId,
  overallProgress,
  modelId,
  onModelIdChange,
  parallelCount,
  onParallelCountChange,
  isPreferredModel,
  onPreferredModelChange,
  overwriteMode,
  onOverwriteModeChange,
  isMockMode,
  onMockModeChange,
  onConvert,
  onStop,
  onResume,
  isConverting,
  hasFiles,
  batchStatusNode,
  expanded,
  onExpandedChange,
}: FloatingControlPanelProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const isExpanded = expanded ?? internalExpanded
  const setIsExpanded = onExpandedChange ?? setInternalExpanded

  const [activeTab, setActiveTab] = useState<Tab>('files')
  const reset = useUploadStore((s) => s.reset)

  const completedCount = files.filter((f) => f.status === 'completed').length
  const convertingCount = files.filter((f) => f.status === 'converting').length

  return (
    <div
      className="fixed bottom-3 z-40 w-[420px]"
      style={{ left: 'calc(var(--sidebar-width) + 0.5rem)' }}
    >
      <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTab('files')
                if (!isExpanded) setIsExpanded(true)
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'files' && isExpanded
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              문서 {files.length}개
              {convertingCount > 0 && (
                <span className="text-primary text-[10px]">
                  · {convertingCount} 변환 중
                </span>
              )}
              {completedCount > 0 && (
                <span className="text-[10px] text-[#198038]">
                  · {completedCount} 완료
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('settings')
                if (!isExpanded) setIsExpanded(true)
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'settings' && isExpanded
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              설정
            </button>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Collapsed — progress bar + action buttons */}
        {!isExpanded && (
          <div className="border-border border-t px-4 py-3">
            {overallProgress > 0 && (
              <div className="mb-3">
                <div className="bg-border h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            )}
            {batchStatusNode}
            <div className={batchStatusNode ? 'mt-2' : ''}>
              <ActionButtons
                onConvert={onConvert}
                onStop={onStop}
                onResume={onResume}
                isConverting={isConverting}
                hasFiles={hasFiles}
              />
            </div>
          </div>
        )}

        {/* Expanded — tab content */}
        {isExpanded && (
          <div className="border-border border-t">
            {/* Tab-specific content */}
            {activeTab === 'files' && (
              <>
                <div className="h-[260px] overflow-y-auto px-4 py-3">
                  <UploadedFilesList
                    files={files}
                    onRemoveFile={onRemoveFile}
                    onFileSelect={onFileSelect}
                    onFilesAdded={onFilesAdded}
                    selectedFileId={selectedFileId}
                    overallProgress={overallProgress}
                    onReset={reset}
                  />
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <>
                {batchStatusNode && (
                  <div className="px-4 pt-3">{batchStatusNode}</div>
                )}
                <div className="px-4 py-3">
                  <ConversionSettings
                    modelId={modelId}
                    onModelIdChange={onModelIdChange}
                    parallelCount={parallelCount}
                    onParallelCountChange={onParallelCountChange}
                    isPreferredModel={isPreferredModel}
                    onPreferredModelChange={onPreferredModelChange}
                    overwriteMode={overwriteMode}
                    onOverwriteModeChange={onOverwriteModeChange}
                    alwaysOpen
                  />
                </div>
              </>
            )}

            {/* Common footer — always visible */}
            <div className="border-border bg-muted/40 border-t px-4 py-2.5">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <FlaskConical className="h-3.5 w-3.5" />
                  목업 미리보기
                </span>
                <Switch
                  checked={isMockMode}
                  onCheckedChange={onMockModeChange}
                />
              </label>
            </div>

            <div className="bg-accent/50 border-border border-t px-4 py-3">
              <ActionButtons
                onConvert={onConvert}
                onStop={onStop}
                onResume={onResume}
                isConverting={isConverting}
                hasFiles={hasFiles}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
