import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryProvider } from '@/app/providers'
import { Toaster } from '@/shared/ui/sonner'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryProvider>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools initialIsOpen={false} />
    </QueryProvider>
  )
}
