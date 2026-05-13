import { createFileRoute } from '@tanstack/react-router'
import { BootstrapPage } from '@/pages/bootstrap'

interface BootstrapSearch {
  token?: string
}

export const Route = createFileRoute('/bootstrap')({
  validateSearch: (search: Record<string, unknown>): BootstrapSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: BootstrapPage,
})
