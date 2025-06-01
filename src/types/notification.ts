/* eslint-disable @typescript-eslint/no-explicit-any */
// types/notification.ts
export type NotificationType =
  | 'MatchInvite'
  | 'MatchInviteAccepted'
  | 'MatchCancelled'
  | 'MatchDeclined'
  | 'FriendRequest'
  | 'FriendAccepted'
  | string // fallback for other types

export interface NotificationUser {
  _id: string
  fullName: string
  email: string
  avatar: string
  skillLevel?: string
  location?: {
    type: string
    coordinates: number[]
  }
}

export interface Notification {
  _id: string
  recipient: string
  actor: string
  type: NotificationType
  payload: Record<string, any>
  read: boolean
  createdAt: string
  updatedAt?: string
}
