import { MessageCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface ChatFloatingButtonProps {
  onClick: () => void
}

export function ChatFloatingButton({ onClick }: ChatFloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed right-6 bottom-6 z-40 gap-2 bg-[#198038] px-5 py-3 text-white shadow-2xl transition-all hover:scale-110 hover:bg-[#0e6027]"
      size="lg"
    >
      <MessageCircle className="h-5 w-5" />
      AI 질의응답
    </Button>
  )
}
