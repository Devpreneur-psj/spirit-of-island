import api from './api'

export interface Achievement {
  id: string
  name: string
  description: string | null
  icon: string | null
  category: string
  requirement: Record<string, any>
  reward_coins: number
  reward_item_id: string | null
  created_at: string
  updated_at: string | null
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  progress: Record<string, any>
  completed: string
  completed_at: string | null
  achievement?: Achievement
  created_at: string
  updated_at: string | null
}

export const achievementService = {
  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get<Achievement[]>('/achievements')
    return response.data
  },

  async getMyAchievements(): Promise<UserAchievement[]> {
    const response = await api.get<UserAchievement[]>('/achievements/user/me')
    return response.data
  },

  async claimAchievement(achievementId: string): Promise<UserAchievement> {
    const response = await api.post<UserAchievement>(`/achievements/${achievementId}/claim`)
    return response.data
  },
}

