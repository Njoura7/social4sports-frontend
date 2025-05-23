/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { User } from './userService'

export interface PlayerSearchParams {
  skillLevel?: string
  latitude: number
  longitude: number
  radius?: number
}

// Player services
export const playerService = {
  findPlayers: async (params: PlayerSearchParams): Promise<User[]> => {
    try {
      // Ensure coordinates are valid numbers and convert parameters to match backend API expectations
      const latitude = Number(params.latitude)
      const longitude = Number(params.longitude)

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates')
      }

      const apiParams = {
        lat: latitude,
        lng: longitude,
        ...(params.radius !== undefined && {
          radius: Number(params.radius),
        }), // Send radius if provided and convert to number
        ...(params.skillLevel && { skillLevel: params.skillLevel }),
      }

      return await api.get<User[]>('/players/search', {
        params: apiParams,
      })
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid search parameters')
      }
      throw new Error('Failed to search for players')
    }
  },
}
