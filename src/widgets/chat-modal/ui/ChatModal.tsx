import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, X, MessageCircle, Minimize2 } from 'lucide-react'
import type { ChatMessage } from '@/shared/types'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFile: string
}

export function ChatModal({ isOpen, onClose, selectedFile }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevFileRef = useRef<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && selectedFile && prevFileRef.current !== selectedFile) {
      prevFileRef.current = selectedFile
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initializing chat on file change
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: `문서가 RAG 시스템에 로드되었습니다. (42개 청크)\n\n"${selectedFile.split('/').pop()}" 파일에 대해 궁금한 점을 물어보세요!`,
          timestamp: new Date(),
        },
      ])
      setIsMinimized(false)
    }
  }, [isOpen, selectedFile])

  const handleSend = () => {
    if (!input.trim() || !selectedFile || isLoading) return
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    const query = input
    setInput('')
    setIsLoading(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `질문: "${query}"\n\n답변: 문서에 따르면, 해당 내용은 3페이지의 표 2에 나와 있습니다.`,
          timestamp: new Date(),
        },
      ])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  if (isMinimized) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="rounded-full bg-[#198038] p-4 text-white shadow-2xl transition-all hover:scale-110 hover:bg-[#0e6027]"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-card border-border fixed right-6 bottom-6 z-50 flex h-[600px] w-[420px] flex-col border shadow-2xl">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b bg-[#defbe6] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#198038]/20 p-1.5">
            <Bot className="h-5 w-5 text-[#198038]" />
          </div>
          <div>
            <h3 className="text-foreground text-sm font-semibold">
              AI 질의응답
            </h3>
            <p className="text-muted-foreground max-w-[200px] truncate text-xs">
              {selectedFile.split('/').pop()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-muted/30 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${message.type === 'user' ? 'bg-primary' : 'bg-[#198038]'}`}
            >
              {message.type === 'user' ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[75%] flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}
            >
              <div
                className={`px-3 py-2 shadow-sm ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border-border border'}`}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={`mt-1 text-[10px] ${message.type === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}
                >
                  {message.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#198038]">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-card border-border border px-3 py-2 shadow-sm">
              <div className="flex gap-1">
                <div
                  className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-border bg-card border-t p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="border-border bg-card focus:ring-primary flex-1 resize-none border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="disabled:bg-muted disabled:text-muted-foreground self-end bg-[#198038] px-3 text-white transition-colors hover:bg-[#0e6027] disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-muted-foreground mt-1.5 text-[10px]">
          Enter로 전송, Shift+Enter로 줄바꿈
        </p>
      </div>
    </div>
  )
}
