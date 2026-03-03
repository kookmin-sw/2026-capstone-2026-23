import { useNavigate } from '@tanstack/react-router'
import { FolderOpen } from 'lucide-react'
import { DocumentTable } from '@/widgets/document-table'

export function FilesPage() {
  const navigate = useNavigate()

  const handleFileSelect = (fileId: string) => {
    navigate({ to: '/files/$fileId', params: { fileId } })
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-primary" />
          파일 관리
        </h2>
        <p className="text-sm text-muted-foreground">변환된 문서를 관리하고 다운로드하세요</p>
      </div>
      <DocumentTable onFileSelect={handleFileSelect} />
    </div>
  )
}
