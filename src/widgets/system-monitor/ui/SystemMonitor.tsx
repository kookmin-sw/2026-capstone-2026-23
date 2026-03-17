import { Cpu, HardDrive, Activity, Zap } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

export function SystemMonitor() {
  const systemData = { cpu: 42, memory: 68, activeWorkers: 3, queueSize: 7 }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0984e3]/10">
            <Activity className="h-3.5 w-3.5 text-[#0984e3]" />
          </div>
          <h3 className="text-foreground typo-h3">실시간 시스템 모니터링</h3>
          <span className="bg-muted/60 text-muted-foreground ml-auto rounded-full px-2.5 py-0.5 text-xs">
            5초마다 갱신
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* CPU */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#6c5ce7]" />
              <span className="text-muted-foreground text-sm font-medium">
                CPU 사용률
              </span>
            </div>
            <span className="text-foreground typo-stat">{systemData.cpu}%</span>
            <div className="bg-muted/50 mt-3 flex h-2 overflow-hidden rounded-full">
              <div
                style={{ width: `${systemData.cpu}%` }}
                className="rounded-full bg-[#6c5ce7] transition-all duration-300"
              />
            </div>
          </div>
          {/* Memory */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-[#00b894]" />
              <span className="text-muted-foreground text-sm font-medium">
                메모리 사용률
              </span>
            </div>
            <span className="text-foreground typo-stat">
              {systemData.memory}%
            </span>
            <div className="bg-muted/50 mt-3 flex h-2 overflow-hidden rounded-full">
              <div
                style={{ width: `${systemData.memory}%` }}
                className="rounded-full bg-[#00b894] transition-all duration-300"
              />
            </div>
          </div>
          {/* Workers */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#fdcb6e]" />
              <span className="text-muted-foreground text-sm font-medium">
                활성 워커
              </span>
            </div>
            <span className="text-foreground typo-stat">
              {systemData.activeWorkers}
            </span>
            <span className="text-muted-foreground ml-2 text-sm">
              개 실행 중
            </span>
            <div className="mt-3 flex gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i < systemData.activeWorkers ? 'bg-[#fdcb6e]' : 'bg-muted/50'}`}
                />
              ))}
            </div>
          </div>
          {/* Queue */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#0984e3]" />
              <span className="text-muted-foreground text-sm font-medium">
                대기열
              </span>
            </div>
            <span className="text-foreground typo-stat">
              {systemData.queueSize}
            </span>
            <span className="text-muted-foreground ml-2 text-sm">
              개 대기 중
            </span>
            <p className="text-muted-foreground mt-3 text-xs">
              평균 대기 시간:{' '}
              <span className="text-foreground font-semibold">~5분</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
