import { createFileRoute } from '@tanstack/react-router'
import { ApiTestPage } from '@/pages/api-test'

export const Route = createFileRoute('/api-test')({
  component: ApiTestPage,
})
