import { AlertTriangle } from 'lucide-react'
import { ErrorTable } from '@/widgets/error-table'
import { MockIndicator } from '@/shared/ui/mock-indicator'

export function ErrorLogPage() {
  return (
    <MockIndicator label="에러 로그">
      <div className="flex h-full flex-col gap-3">
        <div>
          <h2 className="text-foreground flex items-center gap-2 text-2xl font-bold">
            <AlertTriangle className="text-destructive h-6 w-6" />
            전체 에러 로그
          </h2>
          <p className="text-muted-foreground text-sm">
            시스템에서 발생한 모든 에러를 확인하고 관리하세요
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <ErrorTable />
        </div>
      </div>
    </MockIndicator>
  )
}
