import { useNavigate } from '@tanstack/react-router'
import { FolderOpen } from 'lucide-react'
import { DocumentTable } from '@/widgets/document-table'

export function FilesPage() {
  const navigate = useNavigate()

  const handleFileSelect = (fileId: string) => {
    console.log('handleFileSelect', fileId)
    navigate({ to: '/files/$fileId', params: { fileId } })
  }

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col gap-3">
      <div>
        <h2 className="text-foreground flex items-center gap-2 text-2xl font-bold">
          <FolderOpen className="text-primary h-6 w-6" />
          파일 관리
        </h2>
        <p className="text-muted-foreground text-sm">
          변환된 문서를 관리하고 다운로드하세요
        </p>
      </div>
      <DocumentTable onFileSelect={handleFileSelect} />
    </div>
  )
}
