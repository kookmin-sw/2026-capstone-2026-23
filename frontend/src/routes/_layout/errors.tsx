import { createFileRoute } from '@tanstack/react-router'
import { ErrorLogPage } from '@/pages/error-log'

export const Route = createFileRoute('/_layout/errors')({
  component: ErrorLogPage,
})
