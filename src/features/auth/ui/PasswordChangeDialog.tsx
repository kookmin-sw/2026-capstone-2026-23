import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { useChangePassword } from '@/entities/session'

interface PasswordChangeDialogProps {
  forced?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PasswordChangeDialog({
  forced = false,
  open: controlledOpen,
  onOpenChange,
}: PasswordChangeDialogProps) {
  const changePassword = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const isOpen = forced ? true : (controlledOpen ?? false)

  const handleOpenChange = (value: boolean) => {
    if (forced) return
    onOpenChange?.(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success('비밀번호가 변경되었습니다.')
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          onOpenChange?.(false)
        },
        onError: () => {
          toast.error(
            '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인하세요.',
          )
        },
      },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => forced && e.preventDefault()}
        onEscapeKeyDown={(e) => forced && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>비밀번호 변경</DialogTitle>
          <DialogDescription>
            {forced
              ? '임시 비밀번호를 사용 중입니다. 계속하려면 비밀번호를 변경하세요.'
              : '새 비밀번호를 입력하세요.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPw">현재 비밀번호</Label>
            <Input
              id="currentPw"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPw">새 비밀번호</Label>
            <Input
              id="newPw"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8자 이상"
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPw">새 비밀번호 확인</Label>
            <Input
              id="confirmPw"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={changePassword.isPending}
          >
            {changePassword.isPending ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
