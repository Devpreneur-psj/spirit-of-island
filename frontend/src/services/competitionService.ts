import api from './api'
import { Competition } from '../types'

export interface CompetitionRanking {
  rank: number
  spiritling_id: string
  spiritling_name: string
  score: number
}

export interface MyRewards {
  rank: number
  score: number
  rewards: Array<{
    id: string
    quantity?: number
  }>
  competition_name: string
  competition_status: string
}

export const competitionService = {
  async getCompetitions(): Promise<Competition[]> {
    const response = await api.get<Competition[]>('/competitions')
    return response.data
  },

  async getCompetition(id: string): Promise<Competition> {
    const response = await api.get<Competition>(`/competitions/${id}`)
    return response.data
  },

  async getCompetitionRanking(id: string): Promise<CompetitionRanking[]> {
    const response = await api.get<CompetitionRanking[]>(`/competitions/${id}/ranking`)
    return response.data
  },

  async enterCompetition(competitionId: string, spiritlingId: string, score: number = 0): Promise<any> {
    const response = await api.post(`/competitions/${competitionId}/enter`, {
      spiritling_id: spiritlingId,
      score,
    })
    return response.data
  },

  async distributeRewards(competitionId: string): Promise<{ message: string; rewards_distributed: any[] }> {
    const response = await api.post(`/competitions/${competitionId}/distribute-rewards`)
    return response.data
  },

  async getMyRewards(competitionId: string): Promise<MyRewards> {
    const response = await api.get<MyRewards>(`/competitions/${competitionId}/my-rewards`)
    return response.data
  },
}

