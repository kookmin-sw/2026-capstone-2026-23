import { Play, Square, RotateCw } from 'lucide-react'

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

      {/* Stop / Resume — subtle text links */}
      <div className="mt-1.5 flex items-center justify-center gap-3">
        <button
          onClick={onStop}
          disabled={!isConverting}
          className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs transition-colors disabled:pointer-events-none disabled:opacity-30"
        >
          <Square className="h-3 w-3" />
          중지
        </button>
        <span className="text-border text-xs">|</span>
        <button
          onClick={onResume}
          disabled={isConverting}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors disabled:pointer-events-none disabled:opacity-30"
        >
          <RotateCw className="h-3 w-3" />
          이어서
        </button>
      </div>
    </div>
  )
}
