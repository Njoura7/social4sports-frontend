import { api } from "./api";
import { User } from "./userService";

// Types
export interface PlayerSearchParams {
  skillLevel?: string;
  latitude: number;
  longitude: number;
  radius?: number; // radius in meters
}

// Player services
export const playerService = {
  findPlayers: (params: PlayerSearchParams) => 
    api.get<User[]>("/players/search", {
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        skillLevel: params.skillLevel,
        lat: params.latitude,
        lng: params.longitude,
        radius: params.radius,
      }
    }),
  
  connectWithPlayer: (playerId: string) => 
    api.post(`/players/${playerId}/connect`),
};
