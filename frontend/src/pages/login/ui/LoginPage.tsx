import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  useBootstrapStatus,
  useLogin,
  isBootstrapResponse,
} from '@/entities/session'

export function LoginPage() {
  const navigate = useNavigate()
  const { data: bootstrap } = useBootstrapStatus()
  const loginMutation = useLogin()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(
      { loginId, password },
      {
        onSuccess: (data) => {
          if (isBootstrapResponse(data)) {
            navigate({
              to: '/bootstrap',
              search: { token: data.bootstrapToken },
            })
          } else {
            navigate({ to: '/dashboard' })
          }
        },
        onError: () => {
          toast.error('아이디 또는 비밀번호가 올바르지 않습니다.')
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
          <div className="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-[#ff7121] opacity-[0.15] blur-[120px]" />
          <div className="absolute top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full bg-[#9d80f7] opacity-[0.12] blur-[100px]" />
          <div className="absolute -bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-[#149de6] opacity-[0.10] blur-[100px]" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute top-[15%] left-[10%] h-20 w-20 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" />
          <div className="animate-float-mid absolute top-[60%] left-[20%] h-14 w-14 rotate-12 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" />
          <div className="animate-float-slow absolute top-[30%] right-[15%] h-24 w-24 -rotate-6 rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" />
          <div className="animate-float-mid absolute right-[25%] bottom-[20%] h-16 w-16 rotate-45 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" />
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
            문서의 지능을
            <br />
            <span className="text-[#ff8c4c]">깨우다.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/50">
            HWP, HWPX, PDF, 이미지 — 어떤 문서든
            <br />
            AI가 구조화된 텍스트로 변환합니다.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span className="font-mono">Vision-Language Model</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="font-mono">GPT-5.2 / DeepSeek OCR</span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
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
            <h2 className="text-foreground mb-2 text-2xl font-bold tracking-tight">
              로그인
            </h2>
            <p className="text-muted-foreground text-sm">
              {bootstrap?.bootstrapRequired
                ? '초기 설정이 필요합니다. 관리자 계정으로 로그인하세요.'
                : '계정 정보를 입력하여 로그인하세요.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="아이디를 입력하세요"
                required
                autoFocus
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
                  placeholder="비밀번호를 입력하세요"
                  required
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

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ff7121] text-sm font-semibold text-white transition-all hover:bg-[#e5641d] hover:shadow-lg hover:shadow-[#ff7121]/20 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  로그인 중...
                </span>
              ) : (
                <>
                  로그인
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="border-border/40 mt-8 border-t pt-6">
            <p className="text-muted-foreground text-center text-xs">
              계정이 없으신가요? 관리자에게 문의하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
