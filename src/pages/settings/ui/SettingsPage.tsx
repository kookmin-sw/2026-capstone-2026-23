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
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

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
  const [userId, setUserId] = useState('kim.cheolsu')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('김철수')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const getStorageColor = () => {
    if (storagePercent >= 90)
      return { bg: 'bg-destructive', text: 'text-destructive' }
    if (storagePercent >= 70)
      return { bg: 'bg-[#f1c21b]', text: 'text-[#684e00]' }
    return { bg: 'bg-primary', text: 'text-primary' }
  }
  const storageColor = getStorageColor()

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      <div>
        <h1 className="text-foreground text-2xl font-bold">설정</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          시스템 설정 및 계정 정보를 관리합니다.
        </p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">개인 설정</TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            관리자 설정
            <span className="bg-[#e8daff] px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-[#6929c4]">
              Admin
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-3 space-y-3">
          {/* Account */}
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="border-border flex items-center gap-2 border-b pb-2">
                <User className="text-muted-foreground h-5 w-5" />
                <h2 className="text-foreground text-lg font-semibold">
                  계정 정보
                </h2>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  본명
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-border bg-card focus:ring-primary flex-1 border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  아이디
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="border-border bg-card focus:ring-primary flex-1 border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    변경
                  </Button>
                </div>
              </div>
              <div className="border-border border-t pt-3">
                <div className="mb-2 flex items-center gap-2">
                  <Lock className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-foreground text-base font-semibold">
                    비밀번호 변경
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      label: '현재 비밀번호',
                      value: currentPassword,
                      onChange: setCurrentPassword,
                      show: showCurrentPassword,
                      toggleShow: () =>
                        setShowCurrentPassword(!showCurrentPassword),
                    },
                    {
                      label: '새 비밀번호',
                      value: newPassword,
                      onChange: setNewPassword,
                      show: showNewPassword,
                      toggleShow: () => setShowNewPassword(!showNewPassword),
                    },
                    {
                      label: '새 비밀번호 확인',
                      value: confirmPassword,
                      onChange: setConfirmPassword,
                      show: showConfirmPassword,
                      toggleShow: () =>
                        setShowConfirmPassword(!showConfirmPassword),
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="text-foreground mb-1 block text-sm font-medium">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={field.show ? 'text' : 'password'}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="border-border bg-card focus:ring-primary w-full border px-3 py-2 pr-10 focus:ring-2 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={field.toggleShow}
                          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
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
                  <Button>
                    <Lock className="mr-2 h-4 w-4" />
                    비밀번호 변경
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Conversion */}
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="border-border flex items-center gap-2 border-b pb-2">
                <FileBox className="h-5 w-5 text-[#ff832b]" />
                <h2 className="text-foreground text-lg font-semibold">
                  파일 변환 설정
                </h2>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  중복 문서 처리 방식
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: 'overwrite' as const,
                      label: '강제 덮어쓰기',
                      desc: '동일한 이름의 파일이 있을 경우 기존 파일을 삭제하고 새로 변환합니다.',
                    },
                    {
                      value: 'create-new' as const,
                      label: '새로운 파일로 만들기',
                      desc: '동일한 이름의 파일이 있을 경우 파일명에 번호를 추가하여 새로 생성합니다.',
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="border-border hover:bg-muted/50 flex cursor-pointer items-start gap-3 border p-3 transition-colors"
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
                        className="accent-primary mt-1 h-4 w-4"
                      />
                      <div>
                        <div className="text-foreground text-sm font-medium">
                          {option.label}
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {option.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-border border-t pt-3">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  설정 저장
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QA AI */}
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="border-border flex items-center gap-2 border-b pb-2">
                <Bot className="text-primary h-5 w-5" />
                <h2 className="text-foreground text-lg font-semibold">
                  질의응답 AI 설정
                </h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-foreground block text-sm font-medium">
                    질의응답 로그 저장
                  </label>
                  <p className="text-muted-foreground mt-1 text-xs">
                    AI 질의응답 기록을 서버에 저장합니다.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSaveQALogs(!saveQALogs)}
                    className={`relative inline-flex h-6 w-11 items-center transition-colors ${saveQALogs ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform bg-white transition-transform ${saveQALogs ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                  <span className="text-foreground text-sm font-medium">
                    {saveQALogs ? '활성화' : '비활성화'}
                  </span>
                </div>
              </div>
              <div className="border-border border-t pt-3">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  설정 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="mt-3 space-y-3">
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="border-border flex items-center gap-2 border-b pb-2">
                <Shield className="h-5 w-5 text-[#8a3ffc]" />
                <h2 className="text-foreground text-lg font-semibold">
                  관리자 설정
                </h2>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  앱 타이틀
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    className="border-border bg-card focus:ring-primary flex-1 border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  앱의 표시 이름을 변경합니다.
                </p>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  사용자 초대
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="초대할 사용자의 이메일 주소"
                    className="border-border bg-card focus:ring-primary flex-1 border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                  <Button className="bg-[#198038] hover:bg-[#0e6027]">
                    <UserPlus className="mr-2 h-4 w-4" />
                    초대
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage */}
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="border-border flex items-center gap-2 border-b pb-2">
                <HardDrive className="text-muted-foreground h-5 w-5" />
                <h2 className="text-foreground text-lg font-semibold">
                  스토리지 관리
                </h2>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  현재 사용량
                </label>
                <div className="bg-muted/50 border-border space-y-2 border p-3">
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
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      전체 용량
                    </span>
                    <span className="text-foreground text-sm font-medium">
                      {storageLimitGB} GB
                    </span>
                  </div>
                  <div className="bg-muted h-3 w-full overflow-hidden">
                    <div
                      className={`h-full ${storageColor.bg} transition-all duration-300`}
                      style={{ width: `${Math.min(storagePercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      사용률
                    </span>
                    <span
                      className={`text-xs font-semibold ${storageColor.text}`}
                    >
                      {storagePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  데이터 저장 경로
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <FolderOpen className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <input
                      type="text"
                      value={storagePath}
                      onChange={(e) => setStoragePath(e.target.value)}
                      className="border-border bg-card focus:ring-primary w-full border py-2 pr-3 pl-10 focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
