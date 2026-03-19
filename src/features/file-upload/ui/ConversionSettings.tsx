import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useModels } from '@/entities/model'
import { Skeleton } from '@/shared/ui/skeleton'

interface ConversionSettingsProps {
  modelId: string
  onModelIdChange: (modelId: string) => void
  parallelCount: number
  onParallelCountChange: (count: number) => void
  isPreferredModel: boolean
  onPreferredModelChange: (isPreferred: boolean) => void
  overwriteMode: 'OVERWRITE' | 'KEEP_BOTH'
  onOverwriteModeChange: (mode: 'OVERWRITE' | 'KEEP_BOTH') => void
  alwaysOpen?: boolean
}

export function ConversionSettings({
  modelId,
  onModelIdChange,
  parallelCount,
  onParallelCountChange,
  isPreferredModel,
  onPreferredModelChange,
  overwriteMode,
  onOverwriteModeChange,
  alwaysOpen = false,
}: ConversionSettingsProps) {
  const { data: modelsData, isLoading: isModelsLoading } = useModels()
  const models = modelsData?.models ?? []
  const [isOpen, setIsOpen] = useState(alwaysOpen)

  return (
    <div>
      {/* Toggle */}
      {!alwaysOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground flex w-full items-center gap-1.5 py-1.5 text-sm font-medium transition-colors"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
          변환 설정
        </button>
      )}

      {/* Collapsible body */}
      {(alwaysOpen || isOpen) && (
        <div
          className={alwaysOpen ? '' : 'border-border mt-1.5 rounded-lg border'}
        >
          {/* VLM Model */}
          <div className={alwaysOpen ? 'py-1' : 'px-3 py-2.5'}>
            <label className="text-muted-foreground mb-1 block text-sm font-medium">
              VLM 모델
            </label>
            {isModelsLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <select
                className="border-border bg-card text-foreground focus:border-primary w-full rounded-md border px-2.5 py-2 text-sm transition-colors focus:outline-none"
                value={modelId}
                onChange={(e) => onModelIdChange(e.target.value)}
              >
                {models.length > 0 ? (
                  models.map((model) => (
                    <option key={model.modelId} value={model.modelId}>
                      {model.displayName} ({model.code})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="m1">GPT-5 Mini (gpt-5-mini)</option>
                    <option value="m2">DeepSeek OCR 2 (deepseek-ocr-2)</option>
                  </>
                )}
              </select>
            )}
            <label className="mt-1.5 flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={isPreferredModel}
                onChange={(e) => onPreferredModelChange(e.target.checked)}
              />
              <span className="text-muted-foreground text-sm">
                선호 모델로 설정
              </span>
            </label>
          </div>

          <div className={alwaysOpen ? 'my-2' : 'border-border border-t'} />

          {/* Parallel + Duplicate */}
          <div
            className={`grid grid-cols-2 ${alwaysOpen ? 'gap-3' : 'divide-border divide-x'}`}
          >
            <div className={alwaysOpen ? 'py-1' : 'px-3 py-2.5'}>
              <label className="text-muted-foreground mb-1 block text-sm font-medium">
                병렬 처리
              </label>
              <input
                type="number"
                min="1"
                max="16"
                className="border-border bg-card text-foreground focus:border-primary w-full rounded-md border px-2.5 py-2 text-sm transition-colors focus:outline-none"
                value={parallelCount}
                onChange={(e) =>
                  onParallelCountChange(parseInt(e.target.value))
                }
              />
              <p className="text-muted-foreground mt-0.5 text-sm">
                1=순차, 2+=동시
              </p>
            </div>

            <div className={alwaysOpen ? 'py-1' : 'px-3 py-2.5'}>
              <label className="text-muted-foreground mb-1 block text-sm font-medium">
                중복 처리
              </label>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="overwriteMode"
                    value="OVERWRITE"
                    checked={overwriteMode === 'OVERWRITE'}
                    onChange={() => onOverwriteModeChange('OVERWRITE')}
                  />
                  <span className="text-foreground text-sm">덮어쓰기</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="overwriteMode"
                    value="KEEP_BOTH"
                    checked={overwriteMode === 'KEEP_BOTH'}
                    onChange={() => onOverwriteModeChange('KEEP_BOTH')}
                  />
                  <span className="text-foreground text-sm">새 파일 생성</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
