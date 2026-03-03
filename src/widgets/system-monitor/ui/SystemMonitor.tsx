import { Cpu, HardDrive, Activity, Zap } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

export function SystemMonitor() {
  const systemData = { cpu: 42, memory: 68, activeWorkers: 3, queueSize: 7 }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Activity className="text-primary h-4 w-4" />
          <h3 className="text-foreground text-lg font-semibold">
            실시간 시스템 모니터링
          </h3>
          <span className="text-muted-foreground ml-auto text-xs">
            5초마다 갱신
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* CPU */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="text-primary h-4 w-4" />
              <span className="text-foreground text-sm font-medium">
                CPU 사용률
              </span>
            </div>
            <span className="text-foreground text-2xl font-bold">
              {systemData.cpu}%
            </span>
            <div className="bg-muted mt-2 flex h-2 overflow-hidden">
              <div
                style={{ width: `${systemData.cpu}%` }}
                className="bg-primary transition-all duration-300"
              />
            </div>
          </div>
          {/* Memory */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-[#198038]" />
              <span className="text-foreground text-sm font-medium">
                메모리 사용률
              </span>
            </div>
            <span className="text-foreground text-2xl font-bold">
              {systemData.memory}%
            </span>
            <div className="bg-muted mt-2 flex h-2 overflow-hidden">
              <div
                style={{ width: `${systemData.memory}%` }}
                className="bg-[#24a148] transition-all duration-300"
              />
            </div>
          </div>
          {/* Workers */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#684e00]" />
              <span className="text-foreground text-sm font-medium">
                활성 워커
              </span>
            </div>
            <span className="text-foreground text-2xl font-bold">
              {systemData.activeWorkers}
            </span>
            <span className="text-muted-foreground ml-2 text-sm">
              개 실행 중
            </span>
            <div className="mt-2 flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 ${i < systemData.activeWorkers ? 'bg-[#f1c21b]' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
          {/* Queue */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#8a3ffc]" />
              <span className="text-foreground text-sm font-medium">
                대기열
              </span>
            </div>
            <span className="text-foreground text-2xl font-bold">
              {systemData.queueSize}
            </span>
            <span className="text-muted-foreground ml-2 text-sm">
              개 대기 중
            </span>
            <p className="text-muted-foreground mt-3 text-xs">
              평균 대기 시간: <span className="font-semibold">~5분</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
