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
    const response = await api.post<TokenResponse>('/auth/login', data)
    localStorage.setItem('access_token', response.data.access_token)
    return response.data
  },

  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>('/auth/register', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  logout(): void {
    localStorage.removeItem('access_token')
  },
}

