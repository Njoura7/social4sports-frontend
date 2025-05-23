export interface UserStats {
  matchesPlayed: number
  winRate: number
  averagePointsFor: string
  averagePointsAgainst: string
  longestStreak: number
}

export interface Match {
  _id: string
  opponent: {
    _id: string
    fullName: string
    avatar: string
  }
  result?: 'Win' | 'Loss'
  score?: string[]
  scheduledFor: string
  status: 'AwaitingConfirmation' | 'Confirmed' | 'Cancelled' | 'Completed'
}
