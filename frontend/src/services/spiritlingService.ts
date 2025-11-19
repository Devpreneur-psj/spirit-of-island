import api from './api'
import { Spiritling } from '../types'

export interface CreateSpiritlingData {
  name: string
  element: string
  personality: string
}

export interface UpdateSpiritlingData {
  name?: string
  hunger?: number
  happiness?: number
  energy?: number
  health?: number
  cleanliness?: number
}

export const spiritlingService = {
  async getSpiritlings(): Promise<Spiritling[]> {
    const response = await api.get<Spiritling[]>('/spiritlings')
    return response.data
  },

  async getSpiritling(id: string): Promise<Spiritling> {
    const response = await api.get<Spiritling>(`/spiritlings/${id}`)
    return response.data
  },

  async createSpiritling(data: CreateSpiritlingData): Promise<Spiritling> {
    const response = await api.post<Spiritling>('/spiritlings', data)
    return response.data
  },

  async updateSpiritling(id: string, data: UpdateSpiritlingData): Promise<Spiritling> {
    const response = await api.patch<Spiritling>(`/spiritlings/${id}`, data)
    return response.data
  },

  async feedSpiritling(id: string): Promise<Spiritling> {
    const response = await api.post<Spiritling>(`/spiritlings/${id}/feed`)
    return response.data
  },

  async playWithSpiritling(id: string): Promise<Spiritling> {
    const response = await api.post<Spiritling>(`/spiritlings/${id}/play`)
    return response.data
  },

  async healSpiritling(id: string): Promise<Spiritling> {
    const response = await api.post<Spiritling>(`/spiritlings/${id}/heal`)
    return response.data
  },

  async cleanSpiritling(id: string): Promise<Spiritling> {
    const response = await api.post<Spiritling>(`/spiritlings/${id}/clean`)
    return response.data
  },

  async trainSpiritling(id: string, statType: string): Promise<Spiritling> {
    const response = await api.post<Spiritling>(`/spiritlings/${id}/train?stat_type=${statType}`)
    return response.data
  },

  async assignTask(id: string, task: string): Promise<Spiritling> {
    const response = await api.post<Spiritling>(`/spiritlings/${id}/assign-task`, { task })
    return response.data
  },
}

