import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Calendar, FileText, Clock, CheckCircle, AlertCircle, SplitSquareHorizontal } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface FileDetailPageProps {
  fileId: string
}

export function FileDetailPage({ fileId }: FileDetailPageProps) {
  const navigate = useNavigate()
  const [showComparison, setShowComparison] = useState(false)

  const file = {
    id: fileId,
    name: '2024_Q4_재무보고서.pdf',
    status: 'completed' as const,
    uploadDate: '2026-02-08 14:32',
    completedDate: '2026-02-08 14:35',
    pages: 24,
    fileSize: '2.4 MB',
    processingTime: '3분 12초',
  }

  const getStatusDisplay = () => {
    switch (file.status) {
      case 'completed':
        return { icon: CheckCircle, text: '변환 완료', color: 'text-[#198038]', bgColor: 'bg-[#defbe6]' }
      default:
        return { icon: AlertCircle, text: '처리 중', color: 'text-muted-foreground', bgColor: 'bg-muted' }
    }
  }

  const statusDisplay = getStatusDisplay()
  const StatusIcon = statusDisplay.icon

  return (
    <div className="min-h-full bg-card">
      <div className="border-b border-border px-8 py-4">
        <button onClick={() => navigate({ to: '/files' })} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">파일 관리로 돌아가기</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${statusDisplay.bgColor}`}>
            <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
            <span className={`text-sm font-medium ${statusDisplay.color}`}>{statusDisplay.text}</span>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-foreground mb-6">{file.name}</h2>

        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>업로드: {file.uploadDate}</span></div>
          <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /><span>완료: {file.completedDate}</span></div>
          <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>{file.pages} 페이지</span></div>
          <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>{file.fileSize}</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>처리 시간: {file.processingTime}</span></div>
        </div>

        <div className="mb-8">
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant={showComparison ? 'default' : 'outline'}
          >
            <SplitSquareHorizontal className="h-4 w-4 mr-2" />
            {showComparison ? '비교 모드 종료' : '원본과 비교'}
          </Button>
        </div>

        <div className="border-t border-border pt-8">
          {showComparison ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-border p-6 bg-muted/30 min-h-[600px]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">원본 문서</h3>
                  <span className="text-xs text-muted-foreground bg-card px-2 py-1 border border-border">{file.name}</span>
                </div>
                <div className="bg-card border border-border h-[520px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">원본 파일 뷰어</p>
                    <p className="text-xs mt-1">한컴 뷰어 등 필요</p>
                  </div>
                </div>
              </div>
              <div className="border border-border p-6 bg-accent/30 min-h-[600px]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">변환된 문서</h3>
                  <span className="text-xs text-primary bg-accent px-2 py-1 border border-primary/20 font-medium">구조화된 데이터</span>
                </div>
                <div className="bg-card border border-border h-[520px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">변환 결과 뷰어</p>
                    <p className="text-xs mt-1">HTML 표, Markdown, 이미지 설명</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">문서 내용이 여기에 표시됩니다</p>
                <p className="text-sm mt-2">HTML 표, Markdown, 이미지 설명 등</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
