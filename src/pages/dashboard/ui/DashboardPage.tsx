import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FlaskConical, Upload, ArrowRight, Sparkles } from 'lucide-react'
import { Switch } from '@/shared/ui/switch'
import {
  DashboardStats,
  TrendChart,
  SuccessRateChart,
} from '@/widgets/dashboard-stats'
import { RecentJobs } from '@/widgets/recent-jobs'
import { SystemMonitor } from '@/widgets/system-monitor'
import { ErrorLogWidget } from '@/widgets/error-log-widget'
import { useDashboardSummary } from '@/entities/system'
import { MockIndicator } from '@/shared/ui/mock-indicator'
import {
  MOCK_DASHBOARD_SUMMARY,
  MOCK_RECENT_ITEMS,
  MOCK_DOCUMENTS_FOR_TREND,
} from '@/shared/lib/mock-dashboard'
import type { DateFilter } from '@/shared/types'

export function DashboardPage() {
  const navigate = useNavigate()
  const currentDate = new Date()
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    type: 'month',
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const datePickerRef = useRef<HTMLDivElement>(null)

  const [isMockMode, setIsMockMode] = useState(false)
  const [isMockLoading, setIsMockLoading] = useState(false)

  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary()

  const handleMockToggle = (checked: boolean) => {
    if (checked) {
      setIsMockLoading(true)
      setIsMockMode(true)
      setTimeout(() => setIsMockLoading(false), 2000)
    } else {
      setIsMockMode(false)
      setIsMockLoading(false)
    }
  }

  const useMock = isMockMode && !isMockLoading
  const showLoading = isMockMode ? isMockLoading : isSummaryLoading

  const stats = useMock
    ? MOCK_DASHBOARD_SUMMARY
    : (summary ?? {
        totalJobs: 0,
        completedJobs: 0,
        processingJobs: 0,
        failedJobs: 0,
      })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDateFilterLabel = () => {
    if (dateFilter.type === 'month' && dateFilter.month)
      return `${dateFilter.month}월`
    if (
      dateFilter.type === 'custom' &&
      dateFilter.startDate &&
      dateFilter.endDate
    ) {
      return `${dateFilter.startDate.replace(/-/g, '.')}~${dateFilter.endDate.replace(/-/g, '.')}`
    }
    return '기간 선택'
  }

  const handleMonthSelect = (month: number) => {
    setDateFilter({
      type: 'month',
      month,
      year: dateFilter.year || currentDate.getFullYear(),
    })
    setShowDatePicker(false)
  }

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setDateFilter({
        type: 'custom',
        startDate: customStartDate,
        endDate: customEndDate,
      })
      setShowDatePicker(false)
    }
  }

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}월`,
  }))

  return (
    <div className="space-y-3">
      {/* Page Title with Date Filter */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <div className="relative" ref={datePickerRef}>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg px-1 text-2xl font-bold transition-all duration-200"
              >
                {formatDateFilterLabel()}
              </button>

              {showDatePicker && (
                <div className="bg-card border-border absolute top-full left-0 z-10 mt-2 w-96 rounded-xl border p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                  <div className="mb-4">
                    <h3 className="text-foreground mb-2 text-sm font-semibold">
                      월 선택
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {months.map((month) => (
                        <button
                          key={month.value}
                          onClick={() => handleMonthSelect(month.value)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                            dateFilter.type === 'month' &&
                            dateFilter.month === month.value
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-muted/60 text-foreground hover:bg-muted'
                          }`}
                        >
                          {month.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-border border-t pt-4">
                    <h3 className="text-foreground mb-2 text-sm font-semibold">
                      기간 선택
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-muted-foreground mb-1 block text-xs">
                          시작일
                        </label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="border-border bg-card focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground mb-1 block text-xs">
                          종료일
                        </label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="border-border bg-card focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleCustomDateApply}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 w-full rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-150"
                      >
                        적용
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <h2 className="text-foreground text-2xl font-bold">의 대시보드</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            전체 문서 처리 현황을 한눈에 확인하세요
          </p>
        </div>

        {/* Mock toggle */}
        <label className="text-muted-foreground flex cursor-pointer items-center gap-2">
          <FlaskConical className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">목업</span>
          <Switch checked={isMockMode} onCheckedChange={handleMockToggle} />
        </label>
      </div>

      {/* 빈 상태 CTA */}
      {!useMock && !showLoading && stats.totalJobs === 0 && (
        <div className="bg-card border-border overflow-hidden rounded-2xl border">
          <div className="flex items-center gap-8 px-8 py-10">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="text-primary h-5 w-5" />
                <span className="text-primary text-xs font-bold tracking-wide uppercase">
                  시작하기
                </span>
              </div>
              <h3 className="text-foreground mb-2 text-xl font-bold">
                첫 번째 문서를 변환해보세요
              </h3>
              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                HWP, PDF, 이미지 문서를 업로드하면 AI가 표, 이미지, 텍스트를
                구조화된 형태로 추출합니다. 변환이 완료되면 여기에 통계가
                표시됩니다.
              </p>
              <button
                onClick={() => navigate({ to: '/convert' })}
                className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <Upload className="h-4 w-4" />
                문서 변환하러 가기
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="hidden shrink-0 lg:flex">
              <div className="flex gap-3">
                {[
                  {
                    label: '업로드',
                    color: 'bg-primary/10 text-primary',
                    icon: Upload,
                  },
                  {
                    label: 'AI 변환',
                    color: 'bg-[#8a3ffc]/10 text-[#8a3ffc]',
                    icon: Sparkles,
                  },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.color}`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className="text-muted-foreground mt-1.5 text-[11px] font-medium">
                        {step.label}
                      </span>
                    </div>
                    {i === 0 && (
                      <ArrowRight className="text-border mb-4 h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <RecentJobs
        mockItems={useMock ? MOCK_RECENT_ITEMS : undefined}
        isLoading={showLoading}
      />
      <DashboardStats stats={stats} isLoading={showLoading} />

      <div className="grid grid-cols-2 gap-4">
        <TrendChart
          mockData={useMock ? MOCK_DOCUMENTS_FOR_TREND : undefined}
          isLoading={showLoading}
        />
        <SuccessRateChart
          mockSummary={useMock ? MOCK_DASHBOARD_SUMMARY : undefined}
          isLoading={showLoading}
        />
      </div>

      <MockIndicator label="에러 로그">
        <ErrorLogWidget onViewAll={() => navigate({ to: '/errors' })} />
      </MockIndicator>
      <MockIndicator label="시스템">
        <SystemMonitor />
      </MockIndicator>
    </div>
  )
}
