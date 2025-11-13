import api from './api'
import { ActionLog } from '../types'

export const actionLogService = {
  async getSpiritlingActionLogs(spiritlingId: string, limit: number = 20): Promise<ActionLog[]> {
    const response = await api.get<ActionLog[]>(`/action-logs/spiritling/${spiritlingId}?limit=${limit}`)
    return response.data
  },
}

