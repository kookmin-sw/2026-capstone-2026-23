export type FileStatus =
  | 'completed'
  | 'converting'
  | 'failed'
  | 'queued'
  | 'pending'

export type ErrorType =
  | 'VLM 타임아웃'
  | '메모리 부족'
  | '변환 실패'
  | '파일 형식 오류'

export interface ErrorDetail {
  id: string
  message: string
  fileName: string
  timestamp: string
  type: string
  stackTrace?: string
  filePath?: string
  pageNumber?: number
  model?: string
}

export interface DocumentItem {
  id: string
  name: string
  date: string
  convertedBy: string
  summary?: string
  hasOriginal: boolean
  hasTmp: boolean
  hasOutput: boolean
}

export interface ConversionJob {
  id: string
  fileName: string
  status: FileStatus
  progress: number
  currentPage?: number
  totalPages?: number
  resultPath?: string
  error?: string
  convertedContent?: string
}

export type VlmModel = 'gpt-5-mini' | 'gpt-5.2' | 'deepseek-ocr-2'

export interface SystemStats {
  cpu: number
  memory: number
  activeWorkers: number
  queueSize: number
}

export interface StorageInfo {
  usedGB: number
  limitGB: number
}

export interface DashboardStats {
  total: number
  completed: number
  inProgress: number
  failed: number
}

export type DateFilterType = 'month' | 'custom'

export interface DateFilter {
  type: DateFilterType
  month?: number
  year?: number
  startDate?: string
  endDate?: string
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}
