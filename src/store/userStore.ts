import { create } from 'zustand'
import { api } from '@/services/api'
import type { UserStats, Match } from '@/types/user'

interface UserState {
  stats: UserStats | null
  matches: Match[]
  loading: boolean
  error: string | null
  fetchUserStats: (userId: string) => Promise<void>
  fetchUserMatches: (userId: string) => Promise<void>
  clearData: () => void
}

export const useUserStore = create<UserState>((set) => ({
  stats: null,
  matches: [],
  loading: false,
  error: null,

  fetchUserStats: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const stats = await api.get<UserStats>(`/users/${userId}/stats`)
      set({ stats })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch stats',
      })
    } finally {
      set({ loading: false })
    }
  },

  fetchUserMatches: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const matches = await api.get<Match[]>(`/users/${userId}/matches`)
      set({ matches })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch matches',
      })
    } finally {
      set({ loading: false })
    }
  },

  clearData: () => set({ stats: null, matches: [] }),
}))
