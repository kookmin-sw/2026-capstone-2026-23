import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
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
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="bg-primary mx-auto mb-2 flex h-12 w-12 items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold">
              L
            </span>
          </div>
          <CardTitle className="text-2xl">Luminir</CardTitle>
          <CardDescription>
            {bootstrap?.bootstrapRequired
              ? '초기 설정이 필요합니다. 관리자 계정으로 로그인하세요.'
              : '계정으로 로그인하세요.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginId">아이디</Label>
              <Input
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
