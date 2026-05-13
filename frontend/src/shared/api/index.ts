export { api } from './client'
export {
  getBootstrapStatus,
  login,
  createSuperuser,
  getMe,
  changePassword,
  createUser,
} from './auth'
export { getHealth } from './health'
export {
  uploadFiles,
  downloadFile,
  downloadDocumentOriginal,
  getDocumentOriginalDownloadUrl,
  previewDocumentOriginal,
  getDocuments,
  getSupportedFileTypes,
  getDocumentResult,
  deleteDocument,
} from './documents'
export {
  convertDocuments,
  getJobStatus,
  getJobItems,
  cancelJob,
  getDocumentProgress,
  getDocumentParserResult,
} from './parser'
export type { ConvertParams } from './parser'
export {
  buildJobProgressWebSocketUrl,
  connectJobProgressSocket,
} from './job-progress-ws'
export { getModels } from './models'
export {
  getDashboardSummary,
  getDashboardFileTypes,
  getDashboardRecentItems,
} from './dashboard'
export { getSystemMonitoring } from './monitoring'
export { getStorageSettings, updateStorageSettings } from './settings'
export {
  createRagSession,
  getRagSessions,
  getRagSession,
  getRagMessages,
  sendRagMessage,
  deleteRagSession,
} from './rag'
export type { CreateRagSessionParams } from './rag'
