
import { api } from "./api";

// Types
export interface Match {
  id: string;
  opponentId: string;
  opponentName: string;
  location: string;
  date: string;
  time?: string;
  confirmed: boolean;
  result?: "Win" | "Loss" | "Draw";
  score?: string;
  createdAt: string;
}

export interface ScheduleMatchData {
  opponentId: string;
  location: string;
  date: string;
  time: string;
}

export interface RecordResultData {
  matchId: string;
  result: "Win" | "Loss" | "Draw";
  score: string;
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
    api.put(`/matches/${matchId}/confirm`),
  
  cancelMatch: (matchId: string) => 
    api.delete(`/matches/${matchId}`),
  
  recordResult: (data: RecordResultData) => 
    api.put(`/matches/${data.matchId}/result`, data),
};
