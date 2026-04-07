import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/widgets/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar'
import { useCurrentUser } from '@/entities/session'
import { PasswordChangeDialog } from '@/features/auth'

export const Route = createFileRoute('/_layout')({
  beforeLoad: () => {
    const token = localStorage.getItem('luminir_token')
    if (!token) {
      throw redirect({ to: '/login' })
    }
  },
  component: LayoutComponent,
})

function LayoutComponent() {
  const { data: user } = useCurrentUser()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto px-4 py-5">
          <Outlet />
        </main>
      </SidebarInset>
      {user?.mustChangePassword && <PasswordChangeDialog forced />}
    </SidebarProvider>
  )
}
