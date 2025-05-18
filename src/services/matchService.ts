import { api } from "./api";

// Types
export interface UserRef {
  _id: string;
  email?: string;
  avatar?: string;
  skillLevel?: string;
  fullName?: string;
}

export interface Match {
  _id: string;
  initiator: UserRef;
  opponent: UserRef;
  location: string;
  scheduledFor: string;
  status: "AwaitingConfirmation" | "Confirmed" | "Cancelled" | "Completed";
  score?: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ScheduleMatchData {
  opponent: string; // opponent ID
  location: string;
  scheduledFor: string; // ISO date string
}

export interface RecordResultData {
  matchId: string;
  score: string[];
  status?: "Completed";
}

// Match services
export const matchService = {
  getUpcomingMatches: () => 
    api.get<Match[]>("/matches/upcoming"),
  
  getPastMatches: () => 
    api.get<Match[]>("/matches/history"),
  
  scheduleMatch: (data: ScheduleMatchData) => 
    api.post<Match>("/matches", data),
  
  confirmMatch: (matchId: string) => 
    api.put<Match>(`/matches/${matchId}/confirm`),
  
  cancelMatch: (matchId: string) =>  
  api.delete(`/matches/${matchId}`),
  
  recordResult: (data: RecordResultData) => 
    api.put<Match>(`/matches/${data.matchId}/result`, {
      score: data.score,
      status: "Completed"
    }),
  
  rescheduleMatch: (matchId: string, newDate: string) =>
    api.put<Match>(`/matches/${matchId}/reschedule`, { scheduledFor: newDate }),
};