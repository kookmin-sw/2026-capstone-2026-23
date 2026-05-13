import { useState } from 'react'
import { toast } from 'sonner'
import {
  Save,
  Shield,
  Bot,
  FileBox,
  User,
  Lock,
  HardDrive,
  FolderOpen,
  ChevronRight,
  FlaskConical,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'
import { MockIndicator } from '@/shared/ui/mock-indicator'
import { UnconnectedBadge } from '@/shared/ui/unconnected-badge'
import { Card, CardContent } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { useUIStore } from '@/app/model/ui-store'
import {
  useStorageSettings,
  useUpdateStorageSettings,
} from '@/entities/settings'
import { useCurrentUser } from '@/entities/session'
import { UserManagement, PasswordChangeDialog } from '@/features/auth'

const inputClass =
  'border-border bg-card text-foreground focus:border-primary focus:ring-primary/20 h-9 w-full rounded-lg border px-3 text-sm transition-colors focus:ring-2 focus:outline-none'

const formatGB = (bytes?: number) =>
  typeof bytes === 'number' ? `${(bytes / 1024 ** 3).toFixed(1)} GB` : '-'

export function SettingsPage() {
  const { isMockMode, setIsMockMode } = useUIStore()
  const [appTitle, setAppTitle] = useState('Luminir Document Parser')
  const [storagePathDraft, setStoragePathDraft] = useState<string | null>(null)
  const [saveQALogs, setSaveQALogs] = useState(true)
  const [duplicateFileHandling, setDuplicateFileHandling] = useState<
    'overwrite' | 'create-new'
  >('create-new')
  const [isPasswordPanelOpen, setIsPasswordPanelOpen] = useState(false)

  const { data: currentUser } = useCurrentUser()
  const isAdmin =
    currentUser?.role === 'SUPERUSER' || currentUser?.role === 'ADMIN'
  const fullName = currentUser?.name ?? ''
  const userId = currentUser?.loginId ?? ''
  const storageSettings = useStorageSettings(isAdmin)
  const updateStorage = useUpdateStorageSettings()
  const storageUsage = storageSettings.data?.usage
  const storagePercent = storageUsage?.usagePercent ?? 0
  const storageUsedLabel = formatGB(storageUsage?.usedBytes)
  const storageLimitLabel = formatGB(storageUsage?.totalBytes)
  const storagePercentLabel = storageUsage
    ? `${storagePercent.toFixed(1)}%`
    : '-'
  const storagePath =
    storagePathDraft ?? storageSettings.data?.storagePath ?? ''

  const handleStorageSave = () => {
    const nextStoragePath = storagePath.trim()
    if (!nextStoragePath) {
      toast.error('Storage path is required.')
      return
    }

    updateStorage.mutate(
      { storagePath: nextStoragePath },
      {
        onSuccess: () => {
          setStoragePathDraft(nextStoragePath)
          toast.success('Storage settings saved.')
        },
      },
    )
  }

  const getStorageColor = () => {
    if (storagePercent >= 90)
      return { bg: 'bg-destructive', text: 'text-destructive' }
    if (storagePercent >= 70)
      return { bg: 'bg-[#f1c21b]', text: 'text-[#684e00]' }
    return { bg: 'bg-primary', text: 'text-primary' }
  }
  const storageColor = getStorageColor()

  return (
    <>
      <MockIndicator label="설정">
        <div className="mx-auto max-w-4xl space-y-3">
          <div>
            <h1 className="text-foreground text-2xl font-bold">설정</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              시스템 설정 및 계정 정보를 관리합니다.
            </p>
          </div>

          <Tabs defaultValue="personal">
            <TabsList
              variant="line"
              className="border-border w-full gap-0 border-b"
            >
              <TabsTrigger
                value="personal"
                className="data-[state=active]:text-primary after:bg-primary flex items-center gap-2 rounded-none px-5 py-3 text-sm font-semibold"
              >
                <User className="h-4 w-4" />
                개인 설정
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:text-primary after:bg-primary flex items-center gap-2 rounded-none px-5 py-3 text-sm font-semibold"
                >
                  <Shield className="h-4 w-4" />
                  관리자 설정
                  <span className="rounded bg-[#e8daff] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#6929c4]">
                    ADMIN
                  </span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* ═══ 개인 설정 ═══ */}
            <TabsContent value="personal" className="mt-4 space-y-4">
              {/* 목업 데이터 */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8a3ffc]/10">
                        <FlaskConical className="h-4 w-4 text-[#8a3ffc]" />
                      </div>
                      <div>
                        <h2 className="text-foreground text-base font-semibold">
                          목업 데이터
                        </h2>
                        <p className="text-muted-foreground text-xs">
                          API 미연결 화면에 샘플 데이터를 표시합니다
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={isMockMode}
                        onCheckedChange={setIsMockMode}
                      />
                      <span
                        className={`text-xs font-semibold ${isMockMode ? 'text-[#8a3ffc]' : 'text-muted-foreground'}`}
                      >
                        {isMockMode ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 계정 정보 */}
              <Card>
                <CardContent className="space-y-5 p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                      <User className="text-primary h-4 w-4" />
                    </div>
                    <h2 className="text-foreground text-base font-semibold">
                      계정 정보
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        본명
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        disabled
                        className="border-border bg-muted/50 text-muted-foreground h-9 w-full cursor-not-allowed rounded-lg border px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        아이디
                      </label>
                      <input
                        type="text"
                        value={userId}
                        disabled
                        className="border-border bg-muted/50 text-muted-foreground h-9 w-full cursor-not-allowed rounded-lg border px-3 text-sm"
                      />
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        아이디는 변경할 수 없습니다.
                      </p>
                    </div>
                  </div>

                  {/* 비밀번호 변경 — 사이드 패널 트리거 */}
                  <div className="border-border border-t pt-5">
                    <button
                      type="button"
                      onClick={() => setIsPasswordPanelOpen(true)}
                      className="hover:bg-muted/50 flex w-full items-center justify-between rounded-lg px-1 py-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                          <Lock className="text-muted-foreground h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-foreground text-sm font-semibold">
                            비밀번호 변경
                          </p>
                          <p className="text-muted-foreground text-xs">
                            계정 비밀번호를 변경합니다
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="text-muted-foreground h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* 파일 변환 설정 */}
              <Card>
                <CardContent className="space-y-5 p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff832b]/10">
                      <FileBox className="h-4 w-4 text-[#ff832b]" />
                    </div>
                    <h2 className="text-foreground text-base font-semibold">
                      파일 변환 설정
                    </h2>
                  </div>

                  <div>
                    <label className="text-muted-foreground mb-2 block text-xs font-medium">
                      중복 문서 처리 방식
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          value: 'overwrite' as const,
                          label: '강제 덮어쓰기',
                          desc: '기존 파일을 삭제하고 새로 변환',
                        },
                        {
                          value: 'create-new' as const,
                          label: '새로운 파일로 만들기',
                          desc: '파일명에 번호를 추가하여 새로 생성',
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                            duplicateFileHandling === option.value
                              ? 'border-primary bg-primary/5 ring-primary/20 ring-2'
                              : 'border-border hover:border-primary/30 hover:bg-muted/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="duplicateHandling"
                            value={option.value}
                            checked={duplicateFileHandling === option.value}
                            onChange={(e) =>
                              setDuplicateFileHandling(
                                e.target.value as 'overwrite' | 'create-new',
                              )
                            }
                            className="accent-primary mt-0.5 h-4 w-4"
                          />
                          <div>
                            <div className="text-foreground text-sm font-medium">
                              {option.label}
                            </div>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {option.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-border border-t pt-4">
                    <UnconnectedBadge>
                      <Button>
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        설정 저장
                      </Button>
                    </UnconnectedBadge>
                  </div>
                </CardContent>
              </Card>

              {/* 질의응답 AI */}
              <Card>
                <CardContent className="space-y-5 p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                      <Bot className="text-primary h-4 w-4" />
                    </div>
                    <h2 className="text-foreground text-base font-semibold">
                      질의응답 AI 설정
                    </h2>
                  </div>

                  <div className="bg-muted/30 flex items-center justify-between rounded-lg p-4">
                    <div>
                      <label className="text-foreground block text-sm font-medium">
                        질의응답 로그 저장
                      </label>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        AI 질의응답 기록을 서버에 저장합니다.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={saveQALogs}
                        onCheckedChange={setSaveQALogs}
                      />
                      <span
                        className={`text-xs font-semibold ${saveQALogs ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        {saveQALogs ? '활성화' : '비활성화'}
                      </span>
                    </div>
                  </div>

                  <div className="border-border border-t pt-4">
                    <UnconnectedBadge>
                      <Button>
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        설정 저장
                      </Button>
                    </UnconnectedBadge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ═══ 관리자 설정 ═══ */}
            {isAdmin && (
              <TabsContent value="admin" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="space-y-5 p-5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8a3ffc]/10">
                        <Shield className="h-4 w-4 text-[#8a3ffc]" />
                      </div>
                      <h2 className="text-foreground text-base font-semibold">
                        관리자 설정
                      </h2>
                    </div>

                    <div>
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        앱 타이틀
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={appTitle}
                          onChange={(e) => setAppTitle(e.target.value)}
                          className={`${inputClass} flex-1`}
                        />
                        <UnconnectedBadge>
                          <Button>
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                            저장
                          </Button>
                        </UnconnectedBadge>
                      </div>
                      <p className="text-muted-foreground mt-1.5 text-xs">
                        앱의 표시 이름을 변경합니다.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <UserManagement />

                {/* 스토리지 */}
                <Card>
                  <CardContent className="space-y-5 p-5">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                        <HardDrive className="text-muted-foreground h-4 w-4" />
                      </div>
                      <h2 className="text-foreground text-base font-semibold">
                        스토리지 관리
                      </h2>
                    </div>

                    <div>
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        현재 사용량
                      </label>
                      <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            사용 중
                          </span>
                          <span
                            className={`text-sm font-semibold ${storageColor.text}`}
                          >
                            {storageSettings.isLoading ? '-' : storageUsedLabel}
                          </span>
                        </div>
                        <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                          <div
                            className={`h-full rounded-full ${storageColor.bg} transition-all duration-300`}
                            style={{
                              width: `${Math.min(storagePercent, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">
                            전체{' '}
                            {storageSettings.isLoading
                              ? '-'
                              : storageLimitLabel}
                          </span>
                          <span
                            className={`text-xs font-semibold ${storageColor.text}`}
                          >
                            {storageSettings.isLoading
                              ? '-'
                              : storagePercentLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-border border-t pt-5">
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        데이터 저장 경로
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FolderOpen className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          <input
                            type="text"
                            value={storagePath}
                            onChange={(e) =>
                              setStoragePathDraft(e.target.value)
                            }
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                        <Button
                          type="button"
                          disabled={
                            storageSettings.isLoading || updateStorage.isPending
                          }
                          onClick={handleStorageSave}
                        >
                          <Save className="mr-1.5 h-3.5 w-3.5" />
                          {updateStorage.isPending ? 'Saving...' : '저장'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </MockIndicator>

      <PasswordChangeDialog
        open={isPasswordPanelOpen}
        onOpenChange={setIsPasswordPanelOpen}
      />
    </>
  )
}
