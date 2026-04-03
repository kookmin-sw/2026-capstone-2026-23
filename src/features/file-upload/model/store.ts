import { create } from 'zustand'

export interface UploadFileItem {
  file: File
  id: string
  status: 'pending' | 'converting' | 'completed' | 'failed'
  progress: number
  currentPage?: number
  totalPages?: number
  resultPath?: string
  error?: string
  convertedContent?: string
  documentId?: string
}

interface UploadState {
  files: UploadFileItem[]
  modelId: string
  parallelCount: number
  isConverting: boolean
  batchStatus: string
  selectedResultPath: string
  isPreferredModel: boolean
  overwriteMode: 'OVERWRITE' | 'KEEP_BOTH'
  jobId: string | null
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  updateFile: (id: string, updates: Partial<UploadFileItem>) => void
  setModelId: (modelId: string) => void
  setParallelCount: (count: number) => void
  setIsConverting: (converting: boolean) => void
  setBatchStatus: (status: string) => void
  setSelectedResultPath: (path: string) => void
  setIsPreferredModel: (preferred: boolean) => void
  setOverwriteMode: (mode: 'OVERWRITE' | 'KEEP_BOTH') => void
  setJobId: (jobId: string | null) => void
  reset: () => void
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  modelId: 'm1',
  parallelCount: 1,
  isConverting: false,
  batchStatus: '',
  selectedResultPath: '',
  isPreferredModel: false,
  overwriteMode: 'OVERWRITE',
  jobId: null,
  addFiles: (newFiles) =>
    set((state) => ({
      files: [
        ...state.files,
        ...newFiles.map((file) => ({
          file,
          id: Math.random().toString(36).substring(2, 11),
          status: 'pending' as const,
          progress: 0,
        })),
      ],
    })),
  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  setModelId: (modelId) => set({ modelId }),
  setParallelCount: (parallelCount) => set({ parallelCount }),
  setIsConverting: (isConverting) => set({ isConverting }),
  setBatchStatus: (batchStatus) => set({ batchStatus }),
  setSelectedResultPath: (selectedResultPath) => set({ selectedResultPath }),
  setIsPreferredModel: (isPreferredModel) => set({ isPreferredModel }),
  setOverwriteMode: (overwriteMode) => set({ overwriteMode }),
  setJobId: (jobId) => set({ jobId }),
  reset: () =>
    set({
      files: [],
      isConverting: false,
      batchStatus: '',
      selectedResultPath: '',
      jobId: null,
    }),
}))
