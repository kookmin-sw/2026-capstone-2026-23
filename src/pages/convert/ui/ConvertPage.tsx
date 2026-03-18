import { MessageCircle } from 'lucide-react'
import { ConversionPanel } from '@/widgets/conversion-panel'
import { ResultsPanel } from '@/widgets/results-panel'
import { ChatModal } from '@/widgets/chat-modal'
import { useUploadStore } from '@/features/file-upload'
import { useUIStore } from '@/app/model/ui-store'
import { useDocumentResult } from '@/entities/document'

export function ConvertPage() {
  const { selectedResultPath, files } = useUploadStore()
  const { isChatOpen, setIsChatOpen } = useUIStore()

  const selectedFile = files.find((f) => f.resultPath === selectedResultPath)
  const { data: documentResult, isLoading: isResultLoading } =
    useDocumentResult(selectedFile?.documentId)

  return (
    <>
      <div className="flex h-full gap-6">
        <div className="w-2/5 shrink-0 overflow-y-auto">
          <ConversionPanel />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <ResultsPanel
            selectedFile={selectedResultPath}
            documentResult={documentResult}
            isLoading={isResultLoading && !!selectedFile?.documentId}
          />
        </div>
      </div>

      {selectedResultPath && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-primary hover:bg-primary/85 fixed right-6 bottom-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-2xl transition-all hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">AI 질의응답</span>
        </button>
      )}

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedFile={selectedResultPath}
      />
    </>
  )
}
