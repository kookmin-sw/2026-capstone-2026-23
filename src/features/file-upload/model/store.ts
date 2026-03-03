import { create } from 'zustand'
import type { VlmModel } from '@/shared/types'

export interface UploadedFile {
  file: File
  id: string
  status: 'pending' | 'converting' | 'completed' | 'failed'
  progress: number
  currentPage?: number
  totalPages?: number
  resultPath?: string
  error?: string
  convertedContent?: string
}

interface UploadState {
  files: UploadedFile[]
  vlmModel: VlmModel
  parallelCount: number
  isConverting: boolean
  batchStatus: string
  selectedResultPath: string
  isPreferredModel: boolean
  overwriteMode: 'overwrite' | 'new'
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  updateFile: (id: string, updates: Partial<UploadedFile>) => void
  setVlmModel: (model: VlmModel) => void
  setParallelCount: (count: number) => void
  setIsConverting: (converting: boolean) => void
  setBatchStatus: (status: string) => void
  setSelectedResultPath: (path: string) => void
  setIsPreferredModel: (preferred: boolean) => void
  setOverwriteMode: (mode: 'overwrite' | 'new') => void
  reset: () => void
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  vlmModel: 'gpt-5.2',
  parallelCount: 1,
  isConverting: false,
  batchStatus: '',
  selectedResultPath: '',
  isPreferredModel: false,
  overwriteMode: 'new',
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
  setVlmModel: (vlmModel) => set({ vlmModel }),
  setParallelCount: (parallelCount) => set({ parallelCount }),
  setIsConverting: (isConverting) => set({ isConverting }),
  setBatchStatus: (batchStatus) => set({ batchStatus }),
  setSelectedResultPath: (selectedResultPath) => set({ selectedResultPath }),
  setIsPreferredModel: (isPreferredModel) => set({ isPreferredModel }),
  setOverwriteMode: (overwriteMode) => set({ overwriteMode }),
  reset: () =>
    set({
      files: [],
      isConverting: false,
      batchStatus: '',
      selectedResultPath: '',
    }),
}))
