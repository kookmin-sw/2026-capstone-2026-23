import { Cpu, HardDrive, Activity, Zap, Inbox } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { useUIStore } from '@/app/model/ui-store'
import { useSystemMonitoring } from '@/entities/system'

const MOCK_SYSTEM_DATA = {
  cpuLoadPercent: 42,
  cpuLoadLabel: '0.42',
  storagePercent: 68,
  processingJobs: 3,
  queueSize: 7,
}

const formatLoad = (value: number | null) =>
  value == null ? '-' : value.toFixed(2)

const formatPercent = (value: number) => `${Math.round(value)}%`

export function SystemMonitor() {
  const { isMockMode } = useUIStore()
  const { data, isLoading, isError } = useSystemMonitoring(!isMockMode)

  const cpuCount = data?.cpu.cpuCount ?? 1
  const loadAverage1m = data?.cpu.loadAverage1m ?? null
  const cpuLoadPercent =
    loadAverage1m == null
      ? 0
      : Math.min((loadAverage1m / Math.max(cpuCount, 1)) * 100, 100)

  const systemData = isMockMode
    ? MOCK_SYSTEM_DATA
    : data
      ? {
          cpuLoadPercent,
          cpuLoadLabel: formatLoad(loadAverage1m),
          storagePercent: data.storage.output.usagePercent,
          processingJobs: data.jobs.processing,
          queueSize: data.jobs.queued,
        }
      : null

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

        {!systemData ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Inbox className="text-muted-foreground/40 mb-2 h-10 w-10" />
            <p className="text-muted-foreground text-sm">
              {isLoading && !isError
                ? '시스템 정보를 불러오는 중입니다'
                : '시스템 정보를 불러올 수 없습니다'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {/* CPU */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#ff7121]" />
                <span className="text-muted-foreground text-sm font-medium">
                  CPU 부하
                </span>
              </div>
              <span className="text-foreground typo-stat">
                {systemData.cpuLoadLabel}
              </span>
              <span className="text-muted-foreground ml-2 text-sm">1분</span>
              <div className="bg-muted/50 mt-3 flex h-2 overflow-hidden rounded-full">
                <div
                  style={{ width: `${systemData.cpuLoadPercent}%` }}
                  className="rounded-full bg-[#ff7121] transition-all duration-300"
                />
              </div>
            </div>
            {/* Storage */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-[#00b894]" />
                <span className="text-muted-foreground text-sm font-medium">
                  스토리지
                </span>
              </div>
              <span className="text-foreground typo-stat">
                {formatPercent(systemData.storagePercent)}
              </span>
              <span className="text-muted-foreground ml-2 text-sm">사용중</span>
              <div className="bg-muted/50 mt-3 flex h-2 overflow-hidden rounded-full">
                <div
                  style={{ width: `${systemData.storagePercent}%` }}
                  className="rounded-full bg-[#00b894] transition-all duration-300"
                />
              </div>
            </div>
            {/* Processing */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#fdcb6e]" />
                <span className="text-muted-foreground text-sm font-medium">
                  처리 중
                </span>
              </div>
              <span className="text-foreground typo-stat">
                {systemData.processingJobs}
              </span>
              <span className="text-muted-foreground ml-2 text-sm">
                개 작업
              </span>
              <div className="mt-3 flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i < Math.min(systemData.processingJobs, 4) ? 'bg-[#fdcb6e]' : 'bg-muted/50'}`}
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
        )}
      </CardContent>
    </Card>
  )
}
