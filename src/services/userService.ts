import { api } from './api'

// Types
export interface User {
  _id: string
  fullName: string
  email: string
  avatar?: string
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
  skillLevel?: 'beginner' | 'intermediate' | 'pro'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  avatar?: string
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
  skillLevel?: 'beginner' | 'intermediate' | 'pro'
}

// User API Services
export const userService = {
  // Authentication
  login: (credentials: LoginCredentials) =>
    api.post<{ accessToken: string }>('/auth/login', credentials),

  register: (data: RegisterData) =>
    api.post<{ user: User; token: string }>('/auth/signup', data),

  logout: () => {
    localStorage.removeItem('authToken')
    return Promise.resolve()
  },

  getUserById: (userId: string) => api.get<User>(`/users/${userId}`),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/users/profile', data),

  searchPlayers: (params: {
    skillLevel?: string
    lat: number
    lng: number
    radius?: number
  }) => api.get<User[]>('/players/search', { params }),
}
