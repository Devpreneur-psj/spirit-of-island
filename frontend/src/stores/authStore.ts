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
      console.log('🔐 authStore.register 호출:', { username, email })
      try {
        console.log('1️⃣ authService.register 호출 중...')
        await authService.register({ username, email, password })
        console.log('2️⃣ 회원가입 성공, 자동 로그인 시작...')
        // 회원가입 후 자동 로그인
        const tokenData = await authService.login({ username, password })
        console.log('3️⃣ 로그인 성공, 사용자 정보 가져오는 중...')
        const user = await authService.getCurrentUser()
        console.log('4️⃣ 사용자 정보:', user)
        localStorage.setItem('access_token', tokenData.access_token)
        set({ token: tokenData.access_token, isAuthenticated: true, user })
        console.log('✅ 회원가입 및 로그인 완료!')
      } catch (error: any) {
        console.error('❌ authStore.register 에러:', error)
        // 에러를 다시 throw하여 컴포넌트에서 처리할 수 있도록 함
        throw error
      }
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

