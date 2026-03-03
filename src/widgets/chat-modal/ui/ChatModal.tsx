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
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#198038] text-white p-4 rounded-full shadow-2xl hover:bg-[#0e6027] transition-all hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] flex flex-col bg-card shadow-2xl border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#defbe6]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#198038]/20">
            <Bot className="h-5 w-5 text-[#198038]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              AI 질의응답
            </h3>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {selectedFile.split('/').pop()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-primary' : 'bg-[#198038]'}`}
            >
              {message.type === 'user' ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            <div
              className={`flex-1 max-w-[75%] ${message.type === 'user' ? 'flex justify-end' : ''}`}
            >
              <div
                className={`px-3 py-2 shadow-sm ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'}`}
              >
                <p className="text-xs whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <p
                  className={`text-[10px] mt-1 ${message.type === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#198038] flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-card px-3 py-2 border border-border shadow-sm">
              <div className="flex gap-1">
                <div
                  className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-3 py-2 border border-border bg-card resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-3 bg-[#198038] text-white hover:bg-[#0e6027] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors self-end"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Enter로 전송, Shift+Enter로 줄바꿈
        </p>
      </div>
    </div>
  )
}
