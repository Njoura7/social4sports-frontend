// stores/notificationStore.ts
import { create } from 'zustand'
import { api } from '@/services/api'
import { Notification } from '@/types/notification'

type NotificationState = {
  notifications: Notification[]
  isLoading: boolean
  error: string | null
}

type NotificationActions = {
  fetchNotifications: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  addNotification: (notification: Notification) => void
  clearNotifications: () => void
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
}

export const useNotificationStore = create<
  NotificationState & NotificationActions
>((set) => ({
  ...initialState,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null })
    try {
      const notifications = await api.get<Notification[]>('/notifications')
      set({ notifications, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`)
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
}))
