import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/widgets/app-sidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/shared/ui/sidebar'
import { Separator } from '@/shared/ui/separator'

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">Luminir Document Parser</span>
        </header>
        <main className="flex-1 overflow-auto px-4 py-3">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
