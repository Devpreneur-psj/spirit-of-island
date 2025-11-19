import { create } from 'zustand'
import { Spiritling } from '../types'
import { spiritlingService } from '../services/spiritlingService'

interface SpiritlingState {
  spiritlings: Spiritling[]
  selectedSpiritling: Spiritling | null
  previousLevel: number | null
  isLoading: boolean
  fetchSpiritlings: () => Promise<void>
  fetchSpiritling: (id: string) => Promise<void>
  createSpiritling: (data: { name: string; element: string; personality: string }) => Promise<void>
  updateSpiritling: (id: string, data: any) => Promise<void>
  feedSpiritling: (id: string) => Promise<void>
  playWithSpiritling: (id: string) => Promise<void>
  healSpiritling: (id: string) => Promise<void>
  cleanSpiritling: (id: string) => Promise<void>
  trainSpiritling: (id: string, statType: string) => Promise<void>
  assignTask: (id: string, task: string) => Promise<Spiritling>
  setSelectedSpiritling: (spiritling: Spiritling | null) => void
  setPreviousLevel: (level: number | null) => void
}

export const useSpiritlingStore = create<SpiritlingState>((set, get) => ({
  spiritlings: [],
  selectedSpiritling: null,
  previousLevel: null,
  isLoading: false,

  fetchSpiritlings: async () => {
    set({ isLoading: true })
    try {
      const spiritlings = await spiritlingService.getSpiritlings()
      set({ spiritlings, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch spiritlings:', error)
      set({ isLoading: false })
    }
  },

  fetchSpiritling: async (id: string) => {
    set({ isLoading: true })
    try {
      const spiritling = await spiritlingService.getSpiritling(id)
      set({ selectedSpiritling: spiritling, isLoading: false })
      // 목록도 업데이트
      const spiritlings = get().spiritlings
      const index = spiritlings.findIndex((s) => s.id === id)
      if (index !== -1) {
        spiritlings[index] = spiritling
        set({ spiritlings })
      }
    } catch (error) {
      console.error('Failed to fetch spiritling:', error)
      set({ isLoading: false })
    }
  },

  createSpiritling: async (data) => {
    try {
      const spiritling = await spiritlingService.createSpiritling(data)
      set((state) => ({
        spiritlings: [...state.spiritlings, spiritling],
      }))
    } catch (error) {
      console.error('Failed to create spiritling:', error)
      throw error
    }
  },

  updateSpiritling: async (id: string, data: any) => {
    try {
      const updatedSpiritling = await spiritlingService.updateSpiritling(id, data)
      set((state) => ({
        spiritlings: state.spiritlings.map((s) =>
          s.id === id ? updatedSpiritling : s
        ),
        selectedSpiritling:
          state.selectedSpiritling?.id === id
            ? updatedSpiritling
            : state.selectedSpiritling,
      }))
    } catch (error) {
      console.error('Failed to update spiritling:', error)
      throw error
    }
  },

  feedSpiritling: async (id: string) => {
    try {
      const state = get()
      const previous = state.selectedSpiritling?.id === id ? state.selectedSpiritling.level : null
      const updatedSpiritling = await spiritlingService.feedSpiritling(id)
      set({
        spiritlings: state.spiritlings.map((s) =>
          s.id === id ? updatedSpiritling : s
        ),
        selectedSpiritling:
          state.selectedSpiritling?.id === id
            ? updatedSpiritling
            : state.selectedSpiritling,
        previousLevel: previous,
      })
    } catch (error) {
      console.error('Failed to feed spiritling:', error)
      throw error
    }
  },

  playWithSpiritling: async (id: string) => {
    try {
      const state = get()
      const previous = state.selectedSpiritling?.id === id ? state.selectedSpiritling.level : null
      const updatedSpiritling = await spiritlingService.playWithSpiritling(id)
      set({
        spiritlings: state.spiritlings.map((s) =>
          s.id === id ? updatedSpiritling : s
        ),
        selectedSpiritling:
          state.selectedSpiritling?.id === id
            ? updatedSpiritling
            : state.selectedSpiritling,
        previousLevel: previous,
      })
    } catch (error) {
      console.error('Failed to play with spiritling:', error)
      throw error
    }
  },

  healSpiritling: async (id: string) => {
    try {
      const state = get()
      const previous = state.selectedSpiritling?.id === id ? state.selectedSpiritling.level : null
      const updatedSpiritling = await spiritlingService.healSpiritling(id)
      set({
        spiritlings: state.spiritlings.map((s) =>
          s.id === id ? updatedSpiritling : s
        ),
        selectedSpiritling:
          state.selectedSpiritling?.id === id
            ? updatedSpiritling
            : state.selectedSpiritling,
        previousLevel: previous,
      })
    } catch (error) {
      console.error('Failed to heal spiritling:', error)
      throw error
    }
  },

  cleanSpiritling: async (id: string) => {
    try {
      const state = get()
      const previous = state.selectedSpiritling?.id === id ? state.selectedSpiritling.level : null
      const updatedSpiritling = await spiritlingService.cleanSpiritling(id)
      set({
        spiritlings: state.spiritlings.map((s) =>
          s.id === id ? updatedSpiritling : s
        ),
        selectedSpiritling:
          state.selectedSpiritling?.id === id
            ? updatedSpiritling
            : state.selectedSpiritling,
        previousLevel: previous,
      })
    } catch (error) {
      console.error('Failed to clean spiritling:', error)
      throw error
    }
  },

  trainSpiritling: async (id: string, statType: string) => {
    try {
      const state = get()
      const previous = state.selectedSpiritling?.id === id ? state.selectedSpiritling.level : null
      const updatedSpiritling = await spiritlingService.trainSpiritling(id, statType)
      set({
        spiritlings: state.spiritlings.map((s) =>
          s.id === id ? updatedSpiritling : s
        ),
        selectedSpiritling:
          state.selectedSpiritling?.id === id
            ? updatedSpiritling
            : state.selectedSpiritling,
        previousLevel: previous,
      })
    } catch (error) {
      console.error('Failed to train spiritling:', error)
      throw error
    }
  },

  assignTask: async (id: string, task: string) => {
    try {
      const updatedSpiritling = await spiritlingService.assignTask(id, task)
      set((state) => ({
        spiritlings: state.spiritlings.map((s) =>
          s.id === id ? updatedSpiritling : s
        ),
        selectedSpiritling:
          state.selectedSpiritling?.id === id
            ? updatedSpiritling
            : state.selectedSpiritling,
      }))
      return updatedSpiritling
    } catch (error) {
      console.error('Failed to assign task:', error)
      throw error
    }
  },

  setSelectedSpiritling: (spiritling: Spiritling | null) => {
    set({ 
      selectedSpiritling: spiritling,
      previousLevel: spiritling ? spiritling.level : null,
    })
  },
  
  setPreviousLevel: (level: number | null) => {
    set({ previousLevel: level })
  },
}))

