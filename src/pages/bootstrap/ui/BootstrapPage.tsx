import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/bootstrap'
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
import { useCreateSuperuser } from '@/entities/session'

export function BootstrapPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const createSuperuser = useCreateSuperuser()

  const [name, setName] = useState('')
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  if (!token) {
    navigate({ to: '/login' })
    return null
  }

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
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="bg-primary mx-auto mb-2 flex h-12 w-12 items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold">
              L
            </span>
          </div>
          <CardTitle className="text-2xl">관리자 계정 생성</CardTitle>
          <CardDescription>최초 슈퍼유저 계정을 등록하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginId">아이디</Label>
              <Input
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="사용할 아이디를 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 (8자 이상)"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createSuperuser.isPending}
            >
              {createSuperuser.isPending ? '생성 중...' : '계정 생성'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
