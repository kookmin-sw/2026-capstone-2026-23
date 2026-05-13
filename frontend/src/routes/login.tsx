import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '@/pages/login'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const token = localStorage.getItem('luminir_token')
    if (token) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})
