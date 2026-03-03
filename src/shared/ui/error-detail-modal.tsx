import { AlertTriangle, AlertCircle, FileText, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import type { ErrorDetail } from '@/shared/types'

interface ErrorDetailModalProps {
  error: ErrorDetail | null
  onClose: () => void
}

export function ErrorDetailModal({ error, onClose }: ErrorDetailModalProps) {
  if (!error) return null

  return (
    <Dialog open={!!error} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#fff1f1]">
              <AlertTriangle className="h-6 w-6 text-[#da1e28]" />
            </div>
            <div>
              <DialogTitle>에러 상세 정보</DialogTitle>
              <p className="text-sm text-muted-foreground">ID: {error.id}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Error Type Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fff1f1] text-[#da1e28] font-medium">
            <AlertCircle className="h-4 w-4" />
            {error.type}
          </span>
        </div>

        {/* Error Message */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            에러 메시지
          </h4>
          <p className="text-sm text-foreground bg-[#fff1f1] p-4 border border-[#fa4d56]">
            {error.message}
          </p>
        </div>

        {/* File Information */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              파일 정보
            </h4>
            <div className="bg-muted p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">파일명:</span>
                <span className="text-foreground font-mono">
                  {error.fileName}
                </span>
              </div>
              {error.filePath && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">경로:</span>
                  <span className="text-foreground font-mono text-xs">
                    {error.filePath}
                  </span>
                </div>
              )}
              {error.pageNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">페이지:</span>
                  <span className="text-foreground font-mono">
                    {error.pageNumber}
                  </span>
                </div>
              )}
              {error.model && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">모델:</span>
                  <span className="text-foreground font-mono">
                    {error.model}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              발생 시각
            </h4>
            <div className="bg-muted p-3">
              <p className="text-sm text-foreground font-mono">
                {error.timestamp}
              </p>
            </div>
          </div>
        </div>

        {/* Stack Trace */}
        {error.stackTrace && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              스택 트레이스
            </h4>
            <pre className="bg-[#161616] text-[#42be65] p-4 overflow-x-auto text-xs font-mono whitespace-pre-wrap">
              {error.stackTrace}
            </pre>
          </div>
        )}

        {/* Action Suggestions */}
        <div className="bg-[#edf5ff] border border-[#78a9ff] p-4">
          <h4 className="text-sm font-semibold text-[#002d9c] mb-2">
            권장 조치
          </h4>
          <ul className="text-sm text-[#0043ce] space-y-1 list-disc list-inside">
            {error.type === 'VLM 타임아웃' && (
              <>
                <li>이미지 크기를 줄여 재시도</li>
                <li>타임아웃 설정을 60초로 증가</li>
                <li>VLM 서버 상태 확인</li>
              </>
            )}
            {error.type === '메모리 부족' && (
              <>
                <li>서버 메모리 증설 검토</li>
                <li>이미지 해상도를 낮춰 재시도</li>
                <li>대용량 파일은 분할 처리</li>
              </>
            )}
            {error.type === '변환 실패' && (
              <>
                <li>파일 무결성 확인</li>
                <li>원본 파일을 다시 업로드</li>
                <li>HWP 뷰어로 파일 열림 확인</li>
              </>
            )}
            {error.type === '파일 형식 오류' && (
              <>
                <li>지원되는 파일 형식으로 변환</li>
                <li>파일 확장자 확인</li>
                <li>올바른 파일 형식인지 검증</li>
              </>
            )}
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button>재시도</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
