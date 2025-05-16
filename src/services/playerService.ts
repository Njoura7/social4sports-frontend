
import { api } from "./api";
import { User } from "./userService";

// Types
export interface PlayerSearchParams {
  query?: string;
  skillLevel?: string;
  distance?: string;
  availability?: string;
}

// Player services
export const playerService = {
  findPlayers: (params: PlayerSearchParams) => 
    api.get<User[]>("/players", { 
      headers: { 
        "Content-Type": "application/json" 
      },
      // Convert params to URL search params
      ...(Object.keys(params).length > 0 && {
        body: JSON.stringify(params)
      })
    }),
  
  connectWithPlayer: (playerId: string) => 
    api.post(`/players/${playerId}/connect`),
};
