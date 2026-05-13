import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, MessageCircle, Minimize2, Send, User, X } from 'lucide-react'
import { useCreateRagSession, useSendRagMessage } from '@/entities/rag'
import type { ChatMessage } from '@/shared/types'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFile: string
  documentId?: string
  documentPath?: string
  fileName?: string
  variant?: 'modal' | 'embedded' | 'panel'
}

export function ChatModal({
  isOpen,
  onClose,
  selectedFile,
  documentId,
  documentPath,
  fileName,
  variant = 'modal',
}: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevSourceRef = useRef<string | null>(null)

  const createSession = useCreateRagSession()
  const sendMessage = useSendRagMessage()

  const sourceKey = documentId || documentPath || selectedFile
  const displayName = useMemo(() => {
    if (fileName?.trim()) return fileName.trim()
    const normalized = selectedFile.replace(/\\/g, '/')
    return (
      normalized.split('/').filter(Boolean).pop() || selectedFile || 'Document'
    )
  }, [fileName, selectedFile])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isOpen) return

    if (!sourceKey) {
      prevSourceRef.current = null
      setSessionId(null)
      setMessages([])
      return
    }

    if (prevSourceRef.current === sourceKey) return
    prevSourceRef.current = sourceKey
    setSessionId(null)
    setMessages([])
    setIsLoading(false)
    const requestedSourceKey = sourceKey

    createSession.mutate(
      {
        title: `Chat: ${displayName}`,
        documentIds: documentId ? [documentId] : [],
        documentPaths: documentPath ? [documentPath] : [],
      },
      {
        onSuccess: (session) => {
          if (prevSourceRef.current !== requestedSourceKey) return
          setSessionId(session.sessionId)
          setMessages([
            {
              id: 'intro',
              type: 'assistant',
              content: `Loaded "${displayName}". Ask a question about this document.`,
              timestamp: new Date(),
            },
          ])
        },
        onError: () => {
          if (prevSourceRef.current !== requestedSourceKey) return
          setMessages([
            {
              id: 'intro-error',
              type: 'assistant',
              content: 'Failed to prepare the document chat session.',
              timestamp: new Date(),
            },
          ])
        },
      },
    )

    setIsMinimized(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mutation objects are intentionally excluded
  }, [isOpen, sourceKey, documentId, documentPath, displayName])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading || !sessionId) return

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      type: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    sendMessage.mutate(
      { sessionId, content: trimmed },
      {
        onSuccess: (answer) => {
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-assistant`,
              type: 'assistant',
              content: answer.answer,
              citations: answer.citations,
              timestamp: new Date(),
            },
          ])
          setIsLoading(false)
        },
        onError: (error) => {
          const message =
            error && typeof error === 'object' && 'message' in error
              ? String(error.message)
              : 'Failed to get an answer. Check the document status and try again.'
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-assistant-error`,
              type: 'assistant',
              content: message,
              timestamp: new Date(),
            },
          ])
          setIsLoading(false)
        },
      },
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  const isEmbedded = variant === 'embedded'
  const isPanel = variant === 'panel'

  if (isMinimized && !isPanel) {
    return (
      <div className={isEmbedded ? '' : 'fixed right-6 bottom-3 z-50'}>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="bg-primary hover:bg-primary/85 rounded-full p-4 text-white shadow-2xl transition-all hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    )
  }

  const containerClass = isPanel
    ? 'bg-card border-border flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border'
    : `bg-card border-border flex h-[600px] w-[420px] flex-col overflow-hidden rounded-2xl border shadow-2xl ${
        isEmbedded ? 'mb-3' : 'fixed right-6 bottom-3 z-50'
      }`

  return (
    <div className={containerClass}>
      <div className="border-border bg-accent flex items-center justify-between border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="bg-primary/15 rounded-lg p-1.5">
            <Bot className="text-primary h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-foreground text-sm font-semibold">
              Document Chat
            </h3>
            <p className="text-muted-foreground truncate text-xs">
              {displayName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!isPanel && (
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          )}
          {!isEmbedded && !isPanel && (
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-muted/30 min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                message.type === 'user' ? 'bg-primary' : 'bg-foreground/10'
              }`}
            >
              {message.type === 'user' ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="text-foreground/60 h-4 w-4" />
              )}
            </div>
            <div
              className={`max-w-[75%] flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}
            >
              <div
                className={`rounded-xl px-3 py-2 shadow-sm ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border-border border'
                }`}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.citations?.length ? (
                  <div className="border-border mt-2 border-t pt-1.5">
                    {message.citations.map((citation) => (
                      <p
                        key={`${citation.path}-${citation.fileName}`}
                        className="text-muted-foreground truncate text-[10px]"
                        title={citation.path}
                      >
                        {citation.fileName}
                      </p>
                    ))}
                  </div>
                ) : null}
                <p
                  className={`mt-1 text-[10px] ${
                    message.type === 'user'
                      ? 'text-primary-foreground/60'
                      : 'text-muted-foreground'
                  }`}
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
            <div className="bg-foreground/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
              <Bot className="text-foreground/60 h-4 w-4" />
            </div>
            <div className="bg-card border-border rounded-xl border px-3 py-2 shadow-sm">
              <div className="flex gap-1">
                <div className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full" />
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

      <div className="border-border bg-card border-t p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this document"
            className="border-border bg-card focus:ring-primary flex-1 resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            rows={2}
            disabled={isLoading || !sessionId}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !sessionId}
            className="disabled:bg-muted disabled:text-muted-foreground bg-primary hover:bg-primary/85 self-end rounded-lg px-3 py-2 text-white transition-colors disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
