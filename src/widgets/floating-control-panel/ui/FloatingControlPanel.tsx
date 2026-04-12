import { useState } from 'react'
import {
  FileText,
  Settings,
  FlaskConical,
  RotateCcw,
  PanelRightOpen,
  PanelRightClose,
  Zap,
} from 'lucide-react'
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
  const [internalExpanded, setInternalExpanded] = useState(true)
  const isOpen = expanded ?? internalExpanded
  const setIsOpen = onExpandedChange ?? setInternalExpanded

  const [activeTab, setActiveTab] = useState<Tab>('files')
  const reset = useUploadStore((s) => s.reset)

  const completedCount = files.filter((f) => f.status === 'completed').length
  const failedCount = files.filter((f) => f.status === 'failed').length
  const convertingCount = files.filter((f) => f.status === 'converting').length

  /* ═══════════ Collapsed ═══════════ */
  if (!isOpen) {
    return (
      <div className="bg-card border-border relative flex h-full w-11 flex-shrink-0 flex-col items-center border-l">
        {isConverting && (
          <div className="absolute top-0 right-0 left-0 h-0.5 overflow-hidden">
            <div className="bg-primary h-full w-full animate-pulse" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground hover:text-foreground mt-3 rounded-lg p-1.5 transition-colors"
          title="패널 열기"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>

        <div className="mt-5 flex flex-col items-center gap-1">
          <button
            onClick={() => {
              setActiveTab('files')
              setIsOpen(true)
            }}
            className="hover:bg-muted group relative rounded-lg p-2 transition-all"
            title={`문서 ${files.length}개`}
          >
            <FileText className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
            {files.length > 0 && (
              <span className="bg-foreground text-background absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] leading-none font-bold">
                {files.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('settings')
              setIsOpen(true)
            }}
            className="hover:bg-muted group rounded-lg p-2 transition-all"
            title="설정"
          >
            <Settings className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
          </button>
        </div>

        <div className="mt-auto flex flex-col items-center gap-2.5 pb-3">
          {overallProgress > 0 && (
            <div className="bg-muted h-16 w-1 overflow-hidden rounded-full">
              <div
                className="bg-primary w-full rounded-full transition-all duration-500 ease-out"
                style={{ height: `${overallProgress}%` }}
              />
            </div>
          )}
          {convertingCount > 0 && (
            <div className="relative">
              <Zap className="h-3.5 w-3.5 text-[#ff7121]" />
              <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff7121]" />
            </div>
          )}
          {completedCount > 0 &&
            completedCount === files.length &&
            files.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-[#198038]" />
            )}
          {failedCount > 0 && (
            <span className="h-2 w-2 rounded-full bg-[#da1e28]" />
          )}
        </div>
      </div>
    )
  }

  /* ═══════════ Expanded ═══════════ */
  return (
    <div className="bg-card border-border relative flex h-full w-[280px] flex-shrink-0 flex-col border-l">
      {/* 진행 스트립 */}
      {overallProgress > 0 && (
        <div className="absolute top-0 right-0 left-0 z-10 h-0.5">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      )}

      {/* ── 헤더 ── */}
      <div className="border-border space-y-2.5 border-b px-3 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-foreground text-xs font-semibold">Options</span>
          <div className="flex items-center gap-0.5">
            {files.length > 0 && (
              <button
                onClick={reset}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-md p-1 transition-colors"
                title="전체 초기화"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
              title="패널 접기"
            >
              <PanelRightOpen className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 탭 — 하단 라인 스타일 */}
        <div className="border-border flex border-b">
          {(
            [
              { key: 'files' as Tab, icon: FileText, label: '문서' },
              { key: 'settings' as Tab, icon: Settings, label: '설정' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-1.5 px-3 pb-2 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
              {tab.key === 'files' && files.length > 0 && (
                <span
                  className={`min-w-4 rounded-full px-1 text-center text-[10px] leading-4 font-bold ${
                    activeTab === 'files'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {files.length}
                </span>
              )}
              {activeTab === tab.key && (
                <span className="bg-primary absolute right-0 -bottom-px left-0 h-0.5 rounded-t" />
              )}
            </button>
          ))}
        </div>

        {/* 상태 카운터 */}
        {files.length > 0 &&
          (convertingCount > 0 || completedCount > 0 || failedCount > 0) && (
            <div className="flex items-center gap-2.5 font-mono text-[10px]">
              {convertingCount > 0 && (
                <span className="flex items-center gap-1 text-[#ff7121]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  {convertingCount} converting
                </span>
              )}
              {completedCount > 0 && (
                <span className="flex items-center gap-1 text-[#198038]">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {completedCount} done
                </span>
              )}
              {failedCount > 0 && (
                <span className="flex items-center gap-1 text-[#da1e28]">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {failedCount} failed
                </span>
              )}
            </div>
          )}
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'files' && (
          <div className="px-3 py-3">
            <UploadedFilesList
              files={files}
              onRemoveFile={onRemoveFile}
              onFileSelect={onFileSelect}
              onFilesAdded={onFilesAdded}
              selectedFileId={selectedFileId}
              overallProgress={overallProgress}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="px-3 py-3">
            {batchStatusNode && <div className="mb-3">{batchStatusNode}</div>}
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
        )}
      </div>

      {/* ── 푸터 ── */}
      <div className="border-border border-t">
        <div className="border-border border-b px-3 py-2">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
              <FlaskConical className="h-3 w-3" />
              Mock
            </span>
            <Switch checked={isMockMode} onCheckedChange={onMockModeChange} />
          </label>
        </div>

        <div className="px-3 py-3">
          <ActionButtons
            onConvert={onConvert}
            onStop={onStop}
            onResume={onResume}
            isConverting={isConverting}
            hasFiles={hasFiles}
          />
        </div>
      </div>
    </div>
  )
}
