import { OctagonX, Play, RotateCw, Square } from 'lucide-react'

interface ActionButtonsProps {
  onConvert: () => void
  onStop: () => void
  onForceStop: () => void
  onResume: () => void
  isConverting: boolean
  hasFiles: boolean
}

export function ActionButtons({
  onConvert,
  onStop,
  onForceStop,
  onResume,
  isConverting,
  hasFiles,
}: ActionButtonsProps) {
  return (
    <div>
      {/* Main convert button */}
      <button
        onClick={onConvert}
        disabled={!hasFiles || isConverting}
        className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-40"
      >
        {isConverting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            변환 중...
          </>
        ) : (
          <>
            <Play className="h-3.5 w-3.5" fill="currentColor" />
            변환 실행
          </>
        )}
      </button>

      {isConverting ? (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={onStop}
            className="border-border text-muted-foreground hover:bg-muted flex min-h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors"
          >
            <Square className="h-3.5 w-3.5" />
            중지
          </button>
          <button
            onClick={onForceStop}
            className="border-destructive/45 text-destructive hover:bg-destructive/10 flex min-h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors"
          >
            <OctagonX className="h-3.5 w-3.5" />
            강제 취소
          </button>
        </div>
      ) : (
        <div className="mt-1.5 flex items-center justify-center">
          <button
            onClick={onResume}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
          >
            <RotateCw className="h-3 w-3" />
            이어서
          </button>
        </div>
      )}
    </div>
  )
}
