import api from './api'
import { User, Spiritling } from '../types'

export interface FriendForVillage {
  id: string
  username: string
  email: string
  spiritling_count: number
  created_at: string | null
}

export const villageService = {
  async getUserProfile(userId: string): Promise<User> {
    const response = await api.get<User>(`/village/user/${userId}`)
    return response.data
  },

  async getUserSpiritlings(userId: string): Promise<Spiritling[]> {
    const response = await api.get<Spiritling[]>(`/village/user/${userId}/spiritlings`)
    return response.data
  },

  async getFriendsForVillage(): Promise<FriendForVillage[]> {
    const response = await api.get<FriendForVillage[]>('/village/friends')
    return response.data
  },
}

