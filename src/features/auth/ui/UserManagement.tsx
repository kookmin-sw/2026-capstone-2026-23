import { useState } from 'react'
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
import { useCreateUser } from '@/entities/session'

export function UserManagement() {
  const createUser = useCreateUser()

  const [name, setName] = useState('')
  const [loginId, setLoginId] = useState('')
  const [temporaryPassword, setTemporaryPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'USER'>('USER')

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
      <CardHeader>
        <CardTitle>사용자 초대</CardTitle>
        <CardDescription>
          새 사용자 계정을 생성합니다. 생성된 사용자는 첫 로그인 시 비밀번호를
          변경해야 합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">이름</Label>
            <Input
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="사용자 이름"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userLoginId">아이디</Label>
            <Input
              id="userLoginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="로그인 아이디"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tempPw">임시 비밀번호</Label>
            <Input
              id="tempPw"
              type="password"
              value={temporaryPassword}
              onChange={(e) => setTemporaryPassword(e.target.value)}
              placeholder="8자 이상"
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole">역할</Label>
            <select
              id="userRole"
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'USER')}
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
            >
              <option value="USER">일반 사용자</option>
              <option value="ADMIN">관리자</option>
            </select>
          </div>
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? '생성 중...' : '계정 생성'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
