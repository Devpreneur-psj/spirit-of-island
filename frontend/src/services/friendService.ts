import api from './api'
import { Friend, FriendRequest, SearchedUser } from '../types'

export const friendService = {
  async sendFriendRequest(friendId: string): Promise<Friend> {
    const response = await api.post<Friend>('/friends', {
      friend_id: friendId,
    })
    return response.data
  },

  async getFriendRequests(): Promise<FriendRequest[]> {
    const response = await api.get<FriendRequest[]>('/friends/requests')
    return response.data
  },

  async getFriends(): Promise<Friend[]> {
    const response = await api.get<Friend[]>('/friends')
    return response.data
  },

  async acceptFriendRequest(requestId: string): Promise<Friend> {
    const response = await api.post<Friend>('/friends/accept', {
      friend_request_id: requestId,
    })
    return response.data
  },

  async rejectFriendRequest(requestId: string): Promise<void> {
    await api.post('/friends/reject', {
      friend_request_id: requestId,
    })
  },

  async removeFriend(friendId: string): Promise<void> {
    await api.delete(`/friends/${friendId}`)
  },

  async searchUsers(username: string): Promise<SearchedUser[]> {
    const response = await api.get<SearchedUser[]>(`/friends/search?username=${encodeURIComponent(username)}`)
    return response.data
  },

  async getRecommendedFriends(limit: number = 5): Promise<SearchedUser[]> {
    const response = await api.get<SearchedUser[]>(`/friends/recommendations?limit=${limit}`)
    return response.data
  },
}

