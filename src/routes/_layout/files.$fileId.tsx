import { createFileRoute } from '@tanstack/react-router'
import { FileDetailPage } from '@/pages/file-detail'

export const Route = createFileRoute('/_layout/files/$fileId')({
  component: FileDetailRoute,
})

function FileDetailRoute() {
  const { fileId } = Route.useParams()
  return <FileDetailPage fileId={fileId} />
}
