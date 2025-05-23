// src/types/friend.ts
export interface User {
  _id: string
  fullName: string
  email: string
  avatar: string
  system?: string
  skillLevel?: string
  location?: {
    type: string
    coordinates: number[]
  }
}

export interface FriendRequest {
  _id: string
  requester: User
  recipient: User
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface Friend {
  _id: string
  fullName: string
  email: string
  avatar: string
  since: string // ISO date string
  system?: string
  status?: string // Only present in some API responses
}

export type FriendRequestStatus = FriendRequest['status']

export type ConnectionStatus =
  | 'none' // No connection exists
  | 'pending-sent' // You sent a request
  | 'pending-received' // You received a request
  | 'friends' // Already friends
