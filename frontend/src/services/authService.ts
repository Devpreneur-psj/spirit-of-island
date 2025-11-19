import api from './api'
import { User } from '../types'

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export const authService = {
  async login(data: LoginData): Promise<TokenResponse> {
    console.log('📤 로그인 API 요청 전송:', { url: '/auth/login', username: data.username })
    try {
      const response = await api.post<TokenResponse>('/auth/login', data)
      console.log('✅ 로그인 API 응답 받음')
      localStorage.setItem('access_token', response.data.access_token)
      return response.data
    } catch (error: any) {
      console.error('❌ 로그인 API 요청 실패:', error)
      throw error
    }
  },

  async register(data: RegisterData): Promise<User> {
    console.log('📤 API 요청 전송:', { url: '/auth/register', data: { ...data, password: '***' } })
    try {
      const response = await api.post<User>('/auth/register', data)
      console.log('✅ API 응답 받음:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ API 요청 실패:', error)
      throw error
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  logout(): void {
    localStorage.removeItem('access_token')
  },
}

