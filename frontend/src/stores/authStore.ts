import { create } from 'zustand'
import { User } from '../types'
import { authService } from '../services/authService'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  fetchCurrentUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => {
  // localStorage에서 토큰 확인
  const token = localStorage.getItem('access_token')
  const isAuthenticated = !!token

  return {
    user: null,
    isAuthenticated,
    token,

    login: async (username: string, password: string) => {
      const tokenData = await authService.login({ username, password })
      const user = await authService.getCurrentUser()
      set({ token: tokenData.access_token, isAuthenticated: true, user })
    },

    register: async (username: string, email: string, password: string) => {
      await authService.register({ username, email, password })
      // 회원가입 후 자동 로그인
      const tokenData = await authService.login({ username, password })
      const user = await authService.getCurrentUser()
      set({ token: tokenData.access_token, isAuthenticated: true, user })
    },

    logout: () => {
      authService.logout()
      set({ user: null, isAuthenticated: false, token: null })
    },

    fetchCurrentUser: async () => {
      try {
        const user = await authService.getCurrentUser()
        set({ user, isAuthenticated: true })
      } catch (error) {
        set({ user: null, isAuthenticated: false, token: null })
      }
    },
  }
})

