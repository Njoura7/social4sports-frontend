import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { api } from '@/services/api'
import type { Message } from '@/types/chat'

interface ChatState {
  activeChat: string | null
  messages: Record<string, Message[]>
  unreadCounts: Record<string, number>
  onlineUsers: Set<string>
  typingUsers: Set<string>
  isLoading: boolean
}

interface ChatActions {
  setActiveChat: (peerId: string) => void
  addMessage: (peerId: string, message: Message) => void
  setMessages: (peerId: string, messages: Message[]) => void
  markAsRead: (peerId: string) => void
  setOnlineUsers: (userIds: string[]) => void
  setTyping: (peerId: string, isTyping: boolean) => void
  fetchConversation: (
    peerId: string,
    before?: string,
    limit?: number
  ) => Promise<void>
  sendMessage: (recipientId: string, content: string) => Promise<Message>
  clearMessages: () => void
  setLoading: (loading: boolean) => void
}

const useChatStore = create<ChatState & ChatActions>()(
  persist(
    immer((set, get) => ({
      activeChat: null,
      messages: {},
      unreadCounts: {},
      onlineUsers: new Set(),
      typingUsers: new Set(),
      isLoading: false,

      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading
        })
      },

      setActiveChat: (peerId) => {
        set((state) => {
          state.activeChat = peerId
          if (state.unreadCounts[peerId]) {
            state.unreadCounts[peerId] = 0
          }
        })
      },

      addMessage: (peerId, message) => {
        set((state) => {
          if (!state.messages[peerId]) {
            state.messages[peerId] = []
          }

          let messageId = message._id || message.id
          if (!messageId) {
            console.warn('Message without ID received:', message)
            messageId = `temp-${Date.now()}-${Math.random()}`
            message._id = messageId
          } else {
            message._id = messageId
          }

          // Duplicate prevention
          const messageExists = state.messages[peerId].some(
            (m) => m._id === messageId
          )
          if (messageExists) {
            console.log('Duplicate message prevented:', messageId)
            return
          }

          state.messages[peerId].push(message)
          state.messages[peerId].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
          )

          // Update unread count for incoming messages only
          if (message.sender !== 'me' && state.activeChat !== peerId) {
            state.unreadCounts[peerId] =
              (state.unreadCounts[peerId] || 0) + 1
          }
        })
      },

      setMessages: (peerId, messages) => {
        set((state) => {
          const validMessages = messages
            .filter((msg) => {
              if (!msg) return false
              const hasId = msg._id
              if (!hasId) {
                console.warn('Filtering out message without ID:', msg)
              }
              return hasId
            })
            .map((msg) => ({
              ...msg,
              _id: msg._id,
            }))
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )

          state.messages[peerId] = validMessages
          console.log(
            `Set ${validMessages.length} valid messages for peer ${peerId}`
          )
        })
      },

      markAsRead: (peerId) => {
        set((state) => {
          state.unreadCounts[peerId] = 0
        })
      },

      setOnlineUsers: (userIds) => {
        set((state) => {
          state.onlineUsers = new Set(userIds)
        })
      },

      setTyping: (peerId, isTyping) => {
        set((state) => {
          const newTypingUsers = new Set(state.typingUsers)
          if (isTyping) {
            newTypingUsers.add(peerId)
          } else {
            newTypingUsers.delete(peerId)
          }
          state.typingUsers = newTypingUsers
        })
      },

      fetchConversation: async (peerId, before, limit = 50) => {
        try {
          get().setLoading(true)
          const params = new URLSearchParams()
          if (before) params.append('before', before)
          params.append('limit', limit.toString())

          const messages = await api.get<Message[]>(
            `/messages/${peerId}?${params.toString()}`
          )

          console.log(
            `Fetched ${messages.length} messages for peer ${peerId}`
          )
          get().setMessages(peerId, messages)
        } catch (error) {
          console.error('Failed to fetch conversation:', error)
          throw error
        } finally {
          get().setLoading(false)
        }
      },

      sendMessage: async (recipientId, content) => {
        try {
          const message = await api.post<Message>('/messages', {
            recipientId,
            content,
          })

          console.log('Message sent via API:', message)

          // Add message with 'me' as sender for UI consistency
          get().addMessage(recipientId, {
            ...message,
            sender: 'me',
          })

          return message
        } catch (error) {
          console.error('Failed to send message:', error)
          throw error
        }
      },

      clearMessages: () => {
        set((state) => {
          state.messages = {}
          state.unreadCounts = {}
          state.activeChat = null
        })
      },
    })),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        unreadCounts: state.unreadCounts,
        activeChat: state.activeChat,
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          try {
            return JSON.parse(str)
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)

export default useChatStore
