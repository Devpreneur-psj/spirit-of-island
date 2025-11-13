import api from './api'
import { Item } from '../types'

export interface UserItem {
  id: string
  item_id: string
  name: string
  type: string
  description?: string
  effect: {
    stat?: string
    status?: string
    value: number
  }
  price: number
  rarity: string
  quantity: number
}

export const itemService = {
  async getItems(): Promise<Item[]> {
    const response = await api.get<Item[]>('/items')
    return response.data
  },

  async getItem(id: string): Promise<Item> {
    const response = await api.get<Item>(`/items/${id}`)
    return response.data
  },

  async getUserItems(): Promise<UserItem[]> {
    const response = await api.get<UserItem[]>('/user-items')
    return response.data
  },

  async buyItem(itemId: string, quantity: number = 1): Promise<{ message: string; coins: number; item: UserItem }> {
    const response = await api.post(`/user-items/${itemId}/buy?quantity=${quantity}`)
    return response.data
  },

  async useItem(itemId: string, spiritlingId: string, quantity: number = 1): Promise<{ message: string; spiritling: any }> {
    const response = await api.post(`/user-items/${itemId}/use`, {
      spiritling_id: spiritlingId,
      quantity,
    })
    return response.data
  },
}

