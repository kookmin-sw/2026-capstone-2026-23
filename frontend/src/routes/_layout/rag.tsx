import { createFileRoute } from '@tanstack/react-router'
import { RagPage } from '@/pages/rag'

export const Route = createFileRoute('/_layout/rag')({
  component: RagPage,
})
