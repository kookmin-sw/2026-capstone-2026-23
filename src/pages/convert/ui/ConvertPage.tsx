import { MessageCircle } from 'lucide-react'
import { ConversionPanel } from '@/widgets/conversion-panel'
import { ResultsPanel } from '@/widgets/results-panel'
import { ChatModal } from '@/widgets/chat-modal'
import { useUploadStore } from '@/features/file-upload'
import { useUIStore } from '@/app/model/ui-store'

export function ConvertPage() {
  const { selectedResultPath, files } = useUploadStore()
  const { isChatOpen, setIsChatOpen } = useUIStore()

  const selectedFile = files.find((f) => f.resultPath === selectedResultPath)

  return (
    <>
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <ConversionPanel />
        </div>
        <div className="col-span-3">
          <ResultsPanel
            selectedFile={selectedResultPath}
            convertedContent={selectedFile?.convertedContent}
          />
        </div>
      </div>

      {selectedResultPath && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed right-6 bottom-6 z-40 flex items-center gap-2 bg-[#198038] px-5 py-3 text-white shadow-2xl transition-all hover:scale-110 hover:bg-[#0e6027]"
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
