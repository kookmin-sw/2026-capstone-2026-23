import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/widgets/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar'

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto px-4 py-5">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
