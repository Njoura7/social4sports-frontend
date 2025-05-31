import { useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import useChatStore from '@/store/chatStore'
import useSocket from '@/hooks/useSocket'

export const useMessageHandlers = () => {
  const { user } = useAuth()
  const { activeChat, sendMessage } = useChatStore()
  const {
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
    isConnected,
  } = useSocket()

  const handleSendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!activeChat || !user) {
        throw new Error('No active chat or user')
      }

      try {
        // Send via API for persistence
        const sentMessage = await sendMessage(activeChat, content)
        console.log('Message sent via API:', sentMessage)

        // Send via socket for real-time delivery
        if (isConnected) {
          sendSocketMessage(activeChat, content)
          console.log('Message sent via socket for real-time delivery')
        }

        // Don't return the message, just void
      } catch (error) {
        console.error('Failed to send message:', error)
        throw error
      }
    },
    [activeChat, user, sendMessage, sendSocketMessage, isConnected]
  )

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!activeChat || !isConnected) return

      if (isTyping) {
        startTyping(activeChat)
      } else {
        stopTyping(activeChat)
      }
    },
    [activeChat, isConnected, startTyping, stopTyping]
  )

  return {
    handleSendMessage,
    handleTyping,
  }
}
