import api from './api'

export interface Event {
  id: string
  name: string
  description: string | null
  event_type: string
  start_date: string
  end_date: string
  status: string
  rewards: Record<string, any>
  requirements: Record<string, any>
  multiplier: number
  created_at: string
  updated_at: string | null
}

export interface EventParticipation {
  id: string
  user_id: string
  event_id: string
  progress: Record<string, any>
  rewards_claimed: string[]
  event?: Event
  created_at: string
  updated_at: string | null
}

export const eventService = {
  async getEvents(statusFilter?: string): Promise<Event[]> {
    const url = statusFilter ? `/events?status_filter=${statusFilter}` : '/events'
    const response = await api.get<Event[]>(url)
    return response.data
  },

  async getEvent(eventId: string): Promise<Event> {
    const response = await api.get<Event>(`/events/${eventId}`)
    return response.data
  },

  async participateEvent(eventId: string): Promise<EventParticipation> {
    const response = await api.post<EventParticipation>(`/events/${eventId}/participate`)
    return response.data
  },

  async getMyEvents(): Promise<EventParticipation[]> {
    const response = await api.get<EventParticipation[]>('/events/user/me')
    return response.data
  },

  async claimEventReward(eventId: string, rewardKey: string): Promise<EventParticipation> {
    const response = await api.post<EventParticipation>(`/events/${eventId}/claim-reward?reward_key=${rewardKey}`)
    return response.data
  },
}

