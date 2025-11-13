import api from './api'

export interface Ranking {
  id: string
  user_id: string
  category: string
  rank: number
  score: number
  period: string
  period_start: string | null
  period_end: string | null
  user?: {
    id: string
    username: string
  }
  created_at: string
  updated_at: string | null
}

export interface RankingList {
  category: string
  period: string
  rankings: Ranking[]
  total: number
}

export const rankingService = {
  async getRankings(category: string, period: string = 'all_time', limit: number = 100): Promise<RankingList> {
    const response = await api.get<RankingList>(`/rankings/${category}?period=${period}&limit=${limit}`)
    return response.data
  },

  async getMyRanking(category: string = 'overall', period: string = 'all_time'): Promise<Ranking> {
    const response = await api.get<Ranking>(`/rankings/user/me?category=${category}&period=${period}`)
    return response.data
  },
}

