import { Cpu, HardDrive, Activity, Zap } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

export function SystemMonitor() {
  const systemData = { cpu: 42, memory: 68, activeWorkers: 3, queueSize: 7 }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">실시간 시스템 모니터링</h3>
          <span className="ml-auto text-xs text-muted-foreground">5초마다 갱신</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* CPU */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">CPU 사용률</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{systemData.cpu}%</span>
            <div className="overflow-hidden h-2 mt-2 flex bg-muted">
              <div
                style={{ width: `${systemData.cpu}%` }}
                className="bg-primary transition-all duration-300"
              />
            </div>
          </div>
          {/* Memory */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-4 w-4 text-[#198038]" />
              <span className="text-sm font-medium text-foreground">메모리 사용률</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{systemData.memory}%</span>
            <div className="overflow-hidden h-2 mt-2 flex bg-muted">
              <div
                style={{ width: `${systemData.memory}%` }}
                className="bg-[#24a148] transition-all duration-300"
              />
            </div>
          </div>
          {/* Workers */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-[#684e00]" />
              <span className="text-sm font-medium text-foreground">활성 워커</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{systemData.activeWorkers}</span>
            <span className="text-sm text-muted-foreground ml-2">개 실행 중</span>
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
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-[#8a3ffc]" />
              <span className="text-sm font-medium text-foreground">대기열</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{systemData.queueSize}</span>
            <span className="text-sm text-muted-foreground ml-2">개 대기 중</span>
            <p className="text-xs text-muted-foreground mt-3">
              평균 대기 시간: <span className="font-semibold">~5분</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
