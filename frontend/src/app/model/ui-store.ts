import { create } from 'zustand'

interface UIState {
  showStorageAlert: boolean
  isChatOpen: boolean
  isMockMode: boolean
  setShowStorageAlert: (show: boolean) => void
  setIsChatOpen: (open: boolean) => void
  setIsMockMode: (mock: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  showStorageAlert: false,
  isChatOpen: false,
  isMockMode: false,
  setShowStorageAlert: (showStorageAlert) => set({ showStorageAlert }),
  setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
  setIsMockMode: (isMockMode) => set({ isMockMode }),
}))
