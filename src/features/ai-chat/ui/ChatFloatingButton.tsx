import { MessageCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface ChatFloatingButtonProps {
  onClick: () => void
}

export function ChatFloatingButton({ onClick }: ChatFloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 gap-2 px-5 py-3 bg-[#198038] hover:bg-[#0e6027] text-white shadow-2xl hover:scale-110 transition-all"
      size="lg"
    >
      <MessageCircle className="h-5 w-5" />
      AI 질의응답
    </Button>
  )
}
