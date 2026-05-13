import { useState } from 'react'
import { toast } from 'sonner'
import { UserPlus, Eye, EyeOff, ArrowRight } from 'lucide-react'

import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Card, CardContent } from '@/shared/ui/card'
import { useCreateUser } from '@/entities/session'

export function UserManagement() {
  const createUser = useCreateUser()

  const [name, setName] = useState('')
  const [loginId, setLoginId] = useState('')
  const [temporaryPassword, setTemporaryPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'USER'>('USER')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (temporaryPassword.length < 8) {
      toast.error('임시 비밀번호는 8자 이상이어야 합니다.')
      return
    }

    createUser.mutate(
      { name, loginId, temporaryPassword, role },
      {
        onSuccess: (data) => {
          toast.success(`${data.user.name} 계정이 생성되었습니다.`)
          setName('')
          setLoginId('')
          setTemporaryPassword('')
          setRole('USER')
        },
        onError: () => {
          toast.error('계정 생성에 실패했습니다.')
        },
      },
    )
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ad85]/10">
            <UserPlus className="h-4 w-4 text-[#00ad85]" />
          </div>
          <div>
            <h2 className="text-foreground text-base font-semibold">
              사용자 초대
            </h2>
            <p className="text-muted-foreground text-xs">
              새 사용자 계정을 생성합니다. 첫 로그인 시 비밀번호 변경이
              필요합니다.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="userName"
                className="text-muted-foreground text-xs font-medium"
              >
                이름
              </Label>
              <Input
                id="userName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="사용자 이름"
                required
                className="border-border/60 bg-background h-10 rounded-lg px-3 transition-all focus:border-[#ff7121]/50 focus:ring-[#ff7121]/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="userLoginId"
                className="text-muted-foreground text-xs font-medium"
              >
                아이디
              </Label>
              <Input
                id="userLoginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="로그인 아이디"
                required
                className="border-border/60 bg-background h-10 rounded-lg px-3 transition-all focus:border-[#ff7121]/50 focus:ring-[#ff7121]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="tempPw"
                className="text-muted-foreground text-xs font-medium"
              >
                임시 비밀번호
              </Label>
              <div className="relative">
                <Input
                  id="tempPw"
                  type={showPassword ? 'text' : 'password'}
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                  placeholder="8자 이상"
                  required
                  minLength={8}
                  className="border-border/60 bg-background h-10 rounded-lg px-3 pr-10 transition-all focus:border-[#ff7121]/50 focus:ring-[#ff7121]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="userRole"
                className="text-muted-foreground text-xs font-medium"
              >
                역할
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: 'USER', label: '일반 사용자' },
                    { value: 'ADMIN', label: '관리자' },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={`flex h-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                      role === option.value
                        ? 'border-primary bg-primary/5 text-primary ring-primary/20 ring-2'
                        : 'border-border/60 text-muted-foreground hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value={option.value}
                      checked={role === option.value}
                      onChange={(e) =>
                        setRole(e.target.value as 'ADMIN' | 'USER')
                      }
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-border border-t pt-4">
            <button
              type="submit"
              disabled={createUser.isPending}
              className="group flex h-10 items-center gap-2 rounded-lg bg-[#ff7121] px-5 text-sm font-semibold text-white transition-all hover:bg-[#e5641d] hover:shadow-lg hover:shadow-[#ff7121]/20 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none"
            >
              {createUser.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  생성 중...
                </span>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  계정 생성
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
