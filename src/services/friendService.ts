/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { UserRef } from './matchService'

export enum FriendRequestStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export interface IFriendRequest {
  _id: string
  requester: UserRef
  recipient: UserRef
  status: FriendRequestStatus
  createdAt: string
  updatedAt: string
}

export interface IFriend {
  _id: string
  fullName: string
  email: string
  avatar: string
  since: Date
}

export const friendService = {
  async sendRequest(recipientId: string): Promise<IFriendRequest> {
    try {
      const response = await api.post<IFriendRequest>(
        '/friends/requests',
        { recipientId }
      )
      return response
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Return existing request if available
        const existing = await this.findExistingRequest(recipientId)
        if (existing) return existing
        throw new Error('Friend request already exists')
      }
      throw error
    }
  },

  async findExistingRequest(
    recipientId: string
  ): Promise<IFriendRequest | null> {
    try {
      const sentRequests = await this.getSentRequests()
      return (
        sentRequests.find((req) => req.recipient._id === recipientId) ||
        null
      )
    } catch {
      return null
    }
  },

  async respondRequest(
    requestId: string,
    accept: boolean
  ): Promise<IFriendRequest> {
    const response = await api.put<IFriendRequest>(
      `/friends/requests/${requestId}`,
      { accept }
    )
    return response
  },

  async getReceivedRequests(): Promise<IFriendRequest[]> {
    const response = await api.get<IFriendRequest[]>(
      '/friends/requests/received'
    )
    return response
  },

  async getSentRequests(): Promise<IFriendRequest[]> {
    const response = await api.get<IFriendRequest[]>(
      '/friends/requests/sent'
    )
    return response
  },

  async getFriends(): Promise<IFriend[]> {
    const response = await api.get<IFriend[]>('/friends')
    return response
  },
}
