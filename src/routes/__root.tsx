import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryProvider } from '@/app/providers'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryProvider>
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </QueryProvider>
  )
}
