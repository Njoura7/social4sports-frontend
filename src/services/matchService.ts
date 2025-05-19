import { api, ApiError } from './api'

// Types
export interface UserRef {
  _id: string
  email?: string
  avatar?: string
  skillLevel?: string
  fullName?: string
}

export interface Match {
  _id: string
  initiator: UserRef
  opponent: UserRef
  location: string
  scheduledFor: string
  status: 'AwaitingConfirmation' | 'Confirmed' | 'Cancelled' | 'Completed'
  score?: string[]
  result?: 'Win' | 'Loss'
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface ScheduleMatchData {
  opponent: string // opponent ID
  location: string
  scheduledFor: string // ISO date string
}

export interface RecordResultData {
  matchId: string
  score: string[]
  result: 'Win' | 'Loss'
}

// Match services
export const matchService = {
  getUpcomingMatches: () => api.get<Match[]>('/matches/upcoming'),

  getPastMatches: () => api.get<Match[]>('/matches/history'),

  scheduleMatch: (data: ScheduleMatchData) =>
    api.post<Match>('/matches', data),

  confirmMatch: async (matchId: string): Promise<Match> => {
    try {
      const response = await api.put<Match>(`/matches/${matchId}/confirm`)
      return response
    } catch (error) {
      console.error('Confirm match error:', error)
      throw new Error(
        error instanceof ApiError && error.status === 404
          ? 'Match not found or you are not the opponent'
          : 'Failed to confirm match'
      )
    }
  },

  recordResult: async (data: {
    matchId: string
    score: string[]
    result: 'Win' | 'Loss'
  }): Promise<Match> => {
    try {
      const response = await api.put<Match>(
        `/matches/${data.matchId}/complete`,
        {
          score: data.score,
          result: data.result,
        }
      )
      return response
    } catch (error) {
      console.error('Record result error:', error)
      throw new Error(
        error instanceof ApiError && error.status === 404
          ? 'Match not found or not allowed'
          : 'Failed to record result'
      )
    }
  },

  cancelMatch: (matchId: string) => api.delete(`/matches/${matchId}`),
  rescheduleMatch: (matchId: string, newDate: string) =>
    api.put<Match>(`/matches/${matchId}/reschedule`, {
      scheduledFor: newDate,
    }),
}
