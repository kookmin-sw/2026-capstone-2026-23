import { useState } from 'react'
import {
  Save,
  UserPlus,
  Shield,
  Bot,
  FileBox,
  User,
  Lock,
  Eye,
  EyeOff,
  HardDrive,
  FolderOpen,
  ChevronRight,
  X,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'
import { MockIndicator } from '@/shared/ui/mock-indicator'
import { UnconnectedBadge } from '@/shared/ui/unconnected-badge'
import { Card, CardContent } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

const inputClass =
  'border-border bg-card text-foreground focus:border-primary focus:ring-primary/20 h-9 w-full rounded-lg border px-3 text-sm transition-colors focus:ring-2 focus:outline-none'

export function SettingsPage() {
  const [appTitle, setAppTitle] = useState('Luminir Document Parser')
  const [inviteEmail, setInviteEmail] = useState('')
  const storageUsedGB = 847.3
  const storageLimitGB = 1000
  const storagePercent = (storageUsedGB / storageLimitGB) * 100
  const [storagePath, setStoragePath] = useState('/var/luminir/data')
  const [saveQALogs, setSaveQALogs] = useState(true)
  const [duplicateFileHandling, setDuplicateFileHandling] = useState<
    'overwrite' | 'create-new'
  >('create-new')
  const [userId] = useState('kim.cheolsu')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('김철수')
  const isFullNameSet = fullName.trim() !== ''
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordPanelOpen, setIsPasswordPanelOpen] = useState(false)

  // TODO: 추후 백엔드 연동 시 실제 유저 권한으로 교체
  const isAdmin = true

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
                      {isFullNameSet ? (
                        <>
                          <input
                            type="text"
                            value={fullName}
                            disabled
                            className="border-border bg-muted/50 text-muted-foreground h-9 w-full cursor-not-allowed rounded-lg border px-3 text-sm"
                          />
                          <p className="text-muted-foreground mt-1 text-[11px]">
                            본명은 최초 1회만 설정할 수 있습니다.
                          </p>
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="본명을 입력하세요"
                            className={`${inputClass} flex-1`}
                          />
                          <UnconnectedBadge>
                            <Button>
                              <Save className="mr-1.5 h-3.5 w-3.5" />
                              저장
                            </Button>
                          </UnconnectedBadge>
                        </div>
                      )}
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

                    <div className="border-border border-t pt-5">
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        사용자 초대
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="초대할 사용자의 이메일 주소"
                          className={`${inputClass} flex-1`}
                        />
                        <UnconnectedBadge>
                          <Button className="bg-[#198038] hover:bg-[#0e6027]">
                            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                            초대
                          </Button>
                        </UnconnectedBadge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                            {storageUsedGB.toFixed(1)} GB
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
                            전체 {storageLimitGB} GB
                          </span>
                          <span
                            className={`text-xs font-semibold ${storageColor.text}`}
                          >
                            {storagePercent.toFixed(1)}%
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
                            onChange={(e) => setStoragePath(e.target.value)}
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                        <UnconnectedBadge>
                          <Button>
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                            저장
                          </Button>
                        </UnconnectedBadge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </MockIndicator>

      {/* 비밀번호 변경 사이드 패널 */}
      {isPasswordPanelOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 transition-opacity"
            onClick={() => setIsPasswordPanelOpen(false)}
          />
          <div className="bg-card border-border fixed top-0 right-0 z-50 flex h-full w-[400px] flex-col border-l shadow-2xl">
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b px-6 py-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Lock className="text-primary h-4 w-4" />
                </div>
                <h2 className="text-foreground text-base font-semibold">
                  비밀번호 변경
                </h2>
              </div>
              <button
                onClick={() => setIsPasswordPanelOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {[
                {
                  label: '현재 비밀번호',
                  placeholder: '현재 비밀번호를 입력하세요',
                  value: currentPassword,
                  onChange: setCurrentPassword,
                  show: showCurrentPassword,
                  toggleShow: () =>
                    setShowCurrentPassword(!showCurrentPassword),
                },
                {
                  label: '새 비밀번호',
                  placeholder: '새 비밀번호를 입력하세요',
                  value: newPassword,
                  onChange: setNewPassword,
                  show: showNewPassword,
                  toggleShow: () => setShowNewPassword(!showNewPassword),
                },
                {
                  label: '새 비밀번호 확인',
                  placeholder: '새 비밀번호를 다시 입력하세요',
                  value: confirmPassword,
                  onChange: setConfirmPassword,
                  show: showConfirmPassword,
                  toggleShow: () =>
                    setShowConfirmPassword(!showConfirmPassword),
                },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={field.show ? 'text' : 'password'}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={field.placeholder}
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={field.toggleShow}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    >
                      {field.show ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-destructive text-xs">
                    새 비밀번호가 일치하지 않습니다.
                  </p>
                )}
            </div>

            {/* Footer */}
            <div className="border-border border-t px-6 py-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPasswordPanelOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors"
                >
                  취소
                </button>
                <UnconnectedBadge>
                  <Button
                    className="flex-1"
                    disabled={
                      !currentPassword ||
                      !newPassword ||
                      newPassword !== confirmPassword
                    }
                  >
                    <Lock className="mr-1.5 h-3.5 w-3.5" />
                    변경하기
                  </Button>
                </UnconnectedBadge>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
