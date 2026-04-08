// ── 공통 응답 래퍼 ──

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: ApiError
}

// ── 문서 상태 ──

export type DocumentStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'

// ── Job 상태 ──

export type JobStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'CANCELLING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED'

// ── 모델 ──

export interface VlmModel {
  modelId: string
  code: string
  displayName: string
  provider: string
  isActive: boolean
}

// ── 파일 업로드 ──

export interface UploadedFile {
  fileId: string
  originalFilename: string
  fileType: string
  sizeBytes: number
  uploadedAt: string
  downloadUrl: string
  processable: boolean
}

// ── 문서 ──

export interface DocumentItem {
  documentId: string
  title: string
  originalFilename: string
  fileType: string
  uploadedAt: string
  latestStatus: DocumentStatus
  jobId: string | null
  processingTimeMs: number | null
  modelCode: string | null
  outputPath: string
  error: ApiError | null
}

// ── 변환 결과 ──

export interface ArtifactTxt {
  artifactId: string
  path: string
  preview: string
}

export interface DocumentResultMeta {
  totalPages: number | null
  processedPages: number | null
  processingTimeMs: number
  completedAt: string
}

export interface ConvertResultItem {
  documentId: string
  fileName: string
  originalFilePath: string
  txt: ArtifactTxt
  htmlPreview: string | null
  markdown: unknown | null
  imageDescriptions: unknown[]
  meta: DocumentResultMeta
  status: DocumentStatus
  error: ApiError | null
}

export interface ConvertResult {
  jobId: string
  status: JobStatus
  modelId: string
  parallelism: number
  totalItems: number
  timeoutSeconds: number
  maxRetries: number
}

// Job Item 목록 응답
export interface JobItemData {
  jobItemId: string
  documentId: string
  status: DocumentStatus
  retryCount: number
  fileName?: string
  sourcePath?: string
}

export interface JobItemsData {
  jobId: string
  items: JobItemData[]
}

// ── Job ──

export interface JobStatusData {
  jobId: string
  status: JobStatus
  cancelRequested: boolean
  cancelledAt: string | null
  totalDocuments: number
  completedDocuments: number
  failedDocuments: number
  processingDocuments: number
  pendingDocuments: number
  completedDocumentIds: string[]
  updatedAt: string
}

// ── 문서 결과 ──

export interface DocumentResult {
  documentId: string
  status: DocumentStatus
  fileName: string
  modelCode: string
  txt: {
    path: string
    preview: string
  }
  htmlPreview: string | null
  markdown: unknown | null
  imageDescriptions: unknown[]
  meta: Record<string, unknown>
  error: ApiError | null
}

// ── 대시보드 ──

export interface DashboardSummary {
  totalJobs: number
  completedJobs: number
  processingJobs: number
  failedJobs: number
}

export interface DashboardFileType {
  type: string
  count: number
}

// ── RAG ──

export interface RagSession {
  sessionId: string
  title: string
  documentIds: string[]
}

export interface RagMessage {
  messageId: string
  role: 'user' | 'assistant'
  content: string
  citations: unknown[]
  createdAt: string
}

export interface RagAnswer {
  sessionId: string
  answer: string
  citations: unknown[]
}

// ── 시스템 ──

export interface SystemStats {
  cpu: number
  memory: {
    total: number
    used: number
    percent: number
  }
  activeWorkers: number
  queueDepth: number
}

// ── 에러 로그 ──

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

// ── 날짜 필터 ──

export type DateFilterType = 'month' | 'custom'

export interface DateFilter {
  type: DateFilterType
  month?: number
  year?: number
  startDate?: string
  endDate?: string
}

// ── Auth ──

export type UserRole = 'SUPERUSER' | 'ADMIN' | 'USER'

export interface AuthUser {
  userId: string
  loginId: string
  name: string
  role: UserRole
  mustChangePassword: boolean
  createdAt: string
  lastLoginAt: string | null
}

export interface BootstrapStatus {
  bootstrapRequired: boolean
  adminEnvConfigured: boolean
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresAt: string
  user: AuthUser
}

export interface BootstrapLoginResponse {
  bootstrapRequired: true
  bootstrapToken: string
  expiresAt: string
  next: string
}

// ── 채팅 (UI용) ──

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}
