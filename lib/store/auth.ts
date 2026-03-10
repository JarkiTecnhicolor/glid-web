'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/api'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean

  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => {
        // Also sync to localStorage for the axios interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem('glid_access_token', accessToken)
          localStorage.setItem('glid_refresh_token', refreshToken)
        }
        set({ accessToken, refreshToken, isAuthenticated: true })
      },

      setUser: (user) => set({ user }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('glid_access_token')
          localStorage.removeItem('glid_refresh_token')
          localStorage.removeItem('glid_user')
        }
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'glid_auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
