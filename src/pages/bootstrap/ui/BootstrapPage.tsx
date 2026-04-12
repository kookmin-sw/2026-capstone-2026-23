import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/bootstrap'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'

import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useCreateSuperuser } from '@/entities/session'

export function BootstrapPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const createSuperuser = useCreateSuperuser()

  const [name, setName] = useState('')
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (!token) {
    navigate({ to: '/login' })
    return null
  }

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    createSuperuser.mutate(
      { bootstrapToken: token, name, loginId, password },
      {
        onSuccess: () => {
          toast.success('관리자 계정이 생성되었습니다.')
          navigate({ to: '/dashboard' })
        },
        onError: () => {
          toast.error('계정 생성에 실패했습니다. 다시 시도해주세요.')
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — Brand Panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0f0f1a] p-10 lg:flex lg:w-[55%]">
        {/* Gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-[#9d80f7] opacity-[0.15] blur-[120px]" />
          <div className="absolute top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full bg-[#ff7121] opacity-[0.12] blur-[100px]" />
          <div className="absolute -bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-[#00ad85] opacity-[0.10] blur-[100px]" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute top-[20%] left-[15%] h-20 w-20 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" />
          <div className="animate-float-mid absolute top-[55%] left-[25%] h-14 w-14 rotate-12 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" />
          <div className="animate-float-slow absolute top-[35%] right-[10%] h-24 w-24 -rotate-6 rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" />
          <div className="animate-float-mid absolute right-[20%] bottom-[25%] h-16 w-16 rotate-45 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff7121]">
              <span className="font-mono text-lg font-bold text-white">L</span>
            </div>
            <span className="font-mono text-lg font-semibold tracking-tight text-white/90">
              Luminir
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="mb-4 text-[2.75rem] leading-[1.1] font-bold tracking-tight text-white">
            시스템을
            <br />
            <span className="text-[#9d80f7]">시작합니다.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/50">
            최초 관리자 계정을 등록하고
            <br />
            Luminir의 모든 기능을 활성화하세요.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span className="font-mono">Initial Setup</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="font-mono">Superuser Registration</span>
          </div>
        </div>
      </div>

      {/* Right — Bootstrap Form */}
      <div className="bg-background flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff7121]">
              <span className="font-mono text-lg font-bold text-white">L</span>
            </div>
            <span className="font-mono text-lg font-semibold tracking-tight">
              Luminir
            </span>
          </div>

          <div className="mb-8">
            <div className="bg-luminir-purple-20 mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5">
              <ShieldCheck className="text-luminir-purple-50 h-3.5 w-3.5" />
              <span className="text-luminir-purple-50 text-xs font-medium">
                초기 설정
              </span>
            </div>
            <h2 className="text-foreground mb-2 text-2xl font-bold tracking-tight">
              관리자 계정 생성
            </h2>
            <p className="text-muted-foreground text-sm">
              최초 슈퍼유저 계정을 등록하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-foreground/80 text-xs font-medium tracking-wide uppercase"
              >
                이름
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                autoFocus
                className="border-border/60 bg-background h-12 rounded-xl px-4 transition-all focus:border-[#ff7121]/50 focus:ring-[#ff7121]/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="loginId"
                className="text-foreground/80 text-xs font-medium tracking-wide uppercase"
              >
                아이디
              </Label>
              <Input
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="사용할 아이디를 입력하세요"
                required
                className="border-border/60 bg-background h-12 rounded-xl px-4 transition-all focus:border-[#ff7121]/50 focus:ring-[#ff7121]/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-foreground/80 text-xs font-medium tracking-wide uppercase"
              >
                비밀번호
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 (8자 이상)"
                  required
                  minLength={8}
                  className="border-border/60 bg-background h-12 rounded-xl px-4 pr-12 transition-all focus:border-[#ff7121]/50 focus:ring-[#ff7121]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-foreground/80 text-xs font-medium tracking-wide uppercase"
              >
                비밀번호 확인
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                minLength={8}
                className={`border-border/60 bg-background h-12 rounded-xl px-4 transition-all focus:border-[#ff7121]/50 focus:ring-[#ff7121]/20 ${
                  passwordMismatch
                    ? 'border-destructive focus:border-destructive'
                    : ''
                }`}
              />
              {passwordMismatch && (
                <p className="text-destructive text-xs">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={createSuperuser.isPending || passwordMismatch}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ff7121] text-sm font-semibold text-white transition-all hover:bg-[#e5641d] hover:shadow-lg hover:shadow-[#ff7121]/20 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none"
            >
              {createSuperuser.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  생성 중...
                </span>
              ) : (
                <>
                  계정 생성
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
