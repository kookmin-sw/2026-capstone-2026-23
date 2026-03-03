import { Play, Square, RotateCw } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface ActionButtonsProps {
  onConvert: () => void
  onStop: () => void
  onResume: () => void
  isConverting: boolean
  hasFiles: boolean
}

export function ActionButtons({
  onConvert,
  onStop,
  onResume,
  isConverting,
  hasFiles,
}: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        onClick={onConvert}
        disabled={!hasFiles || isConverting}
        className="w-full"
        size="lg"
      >
        {isConverting ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            변환 중...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            변환 실행
          </>
        )}
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={onStop}
          disabled={!isConverting}
        >
          <Square className="h-3 w-3 mr-1" />
          중지
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onResume}
          disabled={isConverting}
        >
          <RotateCw className="h-3 w-3 mr-1" />
          이어서
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        중지: 현재 진행중인 작업을 유지하고 새 작업 시작 가능
      </p>
    </div>
  )
}
