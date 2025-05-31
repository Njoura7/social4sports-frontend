import { create } from 'zustand'
import { api } from '@/services/api'
import { toast } from 'sonner'
import type { Friend, FriendRequest } from '@/types/friend'

interface FriendState {
  receivedRequests: FriendRequest[]
  sentRequests: FriendRequest[]
  friends: Friend[]
  loading: boolean
  fetchReceivedRequests: (userId: string) => Promise<void>
  fetchSentRequests: (userId: string) => Promise<void>
  fetchFriends: (userId: string) => Promise<void>
  sendRequest: (requesterId: string, recipientId: string) => Promise<void>
  respondRequest: (
    requestId: string,
    userId: string,
    accept: boolean
  ) => Promise<void>
}

export const useFriendStore = create<FriendState>((set, get) => ({
  receivedRequests: [],
  sentRequests: [],
  friends: [],
  loading: false,

  fetchReceivedRequests: async (userId: string) => {
    set({ loading: true })
    try {
      const requests = await api.get<FriendRequest[]>(
        '/friends/requests/received'
      )
      console.log('Received requests fetched:', requests)
      set({ receivedRequests: requests, loading: false })
    } catch (error) {
      console.error('Failed to fetch received requests:', error)
      set({ loading: false })
      throw error
    }
  },

  fetchSentRequests: async (userId: string) => {
    set({ loading: true })
    try {
      const requests = await api.get<FriendRequest[]>(
        '/friends/requests/sent'
      )
      console.log('Sent requests fetched:', requests)
      set({ sentRequests: requests, loading: false })
    } catch (error) {
      console.error('Failed to fetch sent requests:', error)
      set({ loading: false })
      throw error
    }
  },

  fetchFriends: async (userId: string) => {
    // Don't fetch if already loading
    if (get().loading) {
      console.log('Already loading friends, skipping...')
      return
    }

    set({ loading: true })
    try {
      console.log('Fetching friends from API...')
      const friends = await api.get<Friend[]>('/friends')
      console.log('Friends fetched from API:', friends)
      set({ friends, loading: false })
    } catch (error) {
      console.error('Failed to fetch friends:', error)
      set({ loading: false })
      throw error
    }
  },

  sendRequest: async (requesterId: string, recipientId: string) => {
    set({ loading: true })
    try {
      const request = await api.post<FriendRequest>('/friends/requests', {
        recipientId,
      })
      set((state) => ({
        sentRequests: [...state.sentRequests, request],
        loading: false,
      }))
      toast.success('Friend request sent successfully')
    } catch (error) {
      console.error('Failed to send friend request:', error)
      set({ loading: false })
      throw error
    }
  },

  respondRequest: async (
    requestId: string,
    userId: string,
    accept: boolean
  ) => {
    set({ loading: true })
    try {
      const response = await api.put<FriendRequest>(
        `/friends/requests/${requestId}`,
        { accept }
      )

      set((state) => ({
        receivedRequests: state.receivedRequests.filter(
          (req) => req._id !== requestId
        ),
        friends: accept
          ? [
              ...state.friends,
              {
                _id:
                  response.requester._id === userId
                    ? response.recipient._id
                    : response.requester._id,
                fullName:
                  response.requester._id === userId
                    ? response.recipient.fullName
                    : response.requester.fullName,
                email:
                  response.requester._id === userId
                    ? response.recipient.email
                    : response.requester.email,
                avatar:
                  response.requester._id === userId
                    ? response.recipient.avatar
                    : response.requester.avatar,
                since: new Date().toISOString(),
              },
            ]
          : state.friends,
        loading: false,
      }))

      toast.success(
        accept ? 'Friend request accepted' : 'Friend request rejected'
      )
    } catch (error) {
      console.error('Failed to respond to friend request:', error)
      set({ loading: false })
      throw error
    }
  },
}))
