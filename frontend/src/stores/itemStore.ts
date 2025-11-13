import { create } from 'zustand'
import { Item } from '../types'
import { itemService, UserItem } from '../services/itemService'
import { useAuthStore } from './authStore'

interface ItemState {
  items: Item[]
  userItems: UserItem[]
  isLoading: boolean
  fetchItems: () => Promise<void>
  fetchUserItems: () => Promise<void>
  buyItem: (itemId: string, quantity: number) => Promise<void>
  useItem: (itemId: string, spiritlingId: string, quantity: number) => Promise<void>
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: [],
  userItems: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true })
    try {
      const items = await itemService.getItems()
      set({ items, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch items:', error)
      set({ isLoading: false })
    }
  },

  fetchUserItems: async () => {
    set({ isLoading: true })
    try {
      const userItems = await itemService.getUserItems()
      set({ userItems, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch user items:', error)
      set({ isLoading: false })
    }
  },

  buyItem: async (itemId: string, quantity: number) => {
    try {
      const result = await itemService.buyItem(itemId, quantity)
      // 사용자 코인 업데이트
      const { fetchCurrentUser } = useAuthStore.getState()
      await fetchCurrentUser()
      // 사용자 아이템 목록 새로고침
      await get().fetchUserItems()
      return result
    } catch (error) {
      console.error('Failed to buy item:', error)
      throw error
    }
  },

  useItem: async (itemId: string, spiritlingId: string, quantity: number) => {
    try {
      // 마정령 상태 가져오기 (레벨 업 추적용)
      const { useSpiritlingStore } = await import('./spiritlingStore')
      const spiritlingState = useSpiritlingStore.getState()
      const previous = spiritlingState.selectedSpiritling?.id === spiritlingId 
        ? spiritlingState.selectedSpiritling.level 
        : null
      
      const result = await itemService.useItem(itemId, spiritlingId, quantity)
      // 사용자 아이템 목록 새로고침
      await get().fetchUserItems()
      
      // 마정령 목록도 새로고침하여 레벨 업 반영
      const { fetchSpiritlings } = useSpiritlingStore.getState()
      await fetchSpiritlings()
      
      // 레벨 업 추적을 위해 previousLevel 설정
      if (previous !== null && result?.spiritling) {
        useSpiritlingStore.setState({ previousLevel: previous })
        // 선택된 마정령 업데이트
        const updatedSpiritling = result.spiritling
        useSpiritlingStore.setState((state) => ({
          spiritlings: state.spiritlings.map((s) =>
            s.id === spiritlingId ? updatedSpiritling : s
          ),
          selectedSpiritling:
            state.selectedSpiritling?.id === spiritlingId
              ? updatedSpiritling
              : state.selectedSpiritling,
        }))
      }
      
      return result
    } catch (error: any) {
      console.error('Failed to use item:', error)
      throw error
    }
  },
}))

