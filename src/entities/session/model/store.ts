import { create } from 'zustand'

import type { AuthUser } from '@/shared/types'

const TOKEN_KEY = 'luminir_token'

interface SessionState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setSession: (token: string, user: AuthUser) => void
  clearSession: () => void
  setUser: (user: AuthUser) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),

  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token)
    set({ token, user, isAuthenticated: true })
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, user: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))
