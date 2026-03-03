import type { VlmModel } from '@/shared/types'

interface ConversionSettingsProps {
  vlmModel: VlmModel
  onVlmModelChange: (model: VlmModel) => void
  parallelCount: number
  onParallelCountChange: (count: number) => void
  isPreferredModel: boolean
  onPreferredModelChange: (isPreferred: boolean) => void
  overwriteMode: 'overwrite' | 'new'
  onOverwriteModeChange: (mode: 'overwrite' | 'new') => void
}

export function ConversionSettings({
  vlmModel,
  onVlmModelChange,
  parallelCount,
  onParallelCountChange,
  isPreferredModel,
  onPreferredModelChange,
  overwriteMode,
  onOverwriteModeChange,
}: ConversionSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          VLM 모델 선택
        </label>
        <select
          className="w-full px-3 py-2 border border-border bg-card text-foreground"
          value={vlmModel}
          onChange={(e) => onVlmModelChange(e.target.value as VlmModel)}
        >
          <option value="gpt-5-mini">gpt-5-mini</option>
          <option value="gpt-5.2">gpt-5.2</option>
          <option value="deepseek-ocr-2">deepseek-ocr-2</option>
        </select>
        <p className="text-xs text-muted-foreground mt-1">
          표/이미지 분석에 사용할 VLM 모델을 선택하세요 (deepseek-ocr-2: 폐쇄망
          환경용)
        </p>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={isPreferredModel}
            onChange={(e) => onPreferredModelChange(e.target.checked)}
            className="mr-2 h-4 w-4 accent-primary"
          />
          <span className="text-sm text-foreground">선호 모델로 설정</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          병렬 처리 수
        </label>
        <input
          type="number"
          min="1"
          max="16"
          className="w-full px-3 py-2 border border-border bg-card text-foreground"
          value={parallelCount}
          onChange={(e) => onParallelCountChange(parseInt(e.target.value))}
        />
        <p className="text-xs text-muted-foreground mt-1">
          1=순차(파일 중간 재개 가능), 2 이상=동시 처리
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          중복 파일 처리
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="overwriteMode"
              value="overwrite"
              checked={overwriteMode === 'overwrite'}
              onChange={() => onOverwriteModeChange('overwrite')}
              className="mr-2 h-4 w-4 accent-primary"
            />
            <span className="text-sm text-foreground">강제 덮어쓰기</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="overwriteMode"
              value="new"
              checked={overwriteMode === 'new'}
              onChange={() => onOverwriteModeChange('new')}
              className="mr-2 h-4 w-4 accent-primary"
            />
            <span className="text-sm text-foreground">
              새로운 파일로 생성 (타임스탬프 추가)
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
