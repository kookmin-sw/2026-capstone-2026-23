import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/files')({
  component: FilesRoute,
})

function FilesRoute() {
  return <Outlet />
}
