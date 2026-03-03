import { create } from 'zustand'

interface UIState {
  showStorageAlert: boolean
  isChatOpen: boolean
  setShowStorageAlert: (show: boolean) => void
  setIsChatOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  showStorageAlert: false,
  isChatOpen: false,
  setShowStorageAlert: (showStorageAlert) => set({ showStorageAlert }),
  setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
}))
