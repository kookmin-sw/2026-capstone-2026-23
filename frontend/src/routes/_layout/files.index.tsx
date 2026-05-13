import { createFileRoute } from '@tanstack/react-router'
import { FilesPage } from '@/pages/files'

export const Route = createFileRoute('/_layout/files/')({
  component: FilesPage,
})
