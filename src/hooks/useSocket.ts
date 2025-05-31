/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/hooks/useAuth'
import useChatStore from '@/store/chatStore'

const useSocket = () => {
  const { user, token } = useAuth()
  const { addMessage, setOnlineUsers, setTyping } = useChatStore()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connect = useCallback(() => {
    if (!user?._id || !token) {
      console.log('No user ID or token, skipping socket connection')
      setIsConnected(false)
      return
    }

    // Disconnect existing socket first
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    console.log('Attempting to connect to socket...')

    const socketUrl =
      import.meta.env.VITE_API_URL || 'http://localhost:3000'

    try {
      // Try connecting to the /chat namespace
      socketRef.current = io(`${socketUrl}/chat`, {
        auth: {
          token: token,
        },
        transports: ['polling'], // Use polling only for now
        timeout: 10000,
        reconnection: true,
        reconnectionDelay: 3000,
        reconnectionAttempts: 3,
        forceNew: true,
      })

      const socket = socketRef.current

      socket.on('connect', () => {
        console.log('✅ Socket connected successfully to /chat namespace')
        setIsConnected(true)
      })

      socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason)
        setIsConnected(false)
      })

      socket.on('connect_error', (error) => {
        console.error('🔴 Socket connection error:', error)
        setIsConnected(false)

        // If /chat namespace fails, try default namespace
        console.log('Trying default namespace...')
        if (socketRef.current) {
          socketRef.current.disconnect()
        }

        socketRef.current = io(socketUrl, {
          auth: { token },
          transports: ['polling'],
          timeout: 10000,
          reconnection: false,
          forceNew: true,
        })

        attachEventListeners(socketRef.current)
      })

      attachEventListeners(socket)
    } catch (error) {
      console.error('Failed to create socket connection:', error)
      setIsConnected(false)
    }
  }, [user?._id, token])

  const attachEventListeners = (socket: Socket) => {
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully')
      setIsConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
      setIsConnected(false)
    })

    // Listen for different message event names
    socket.on('new_message', (data) => {
      console.log('📨 Received new_message:', data)
      handleIncomingMessage(data)
    })

    socket.on('message', (data) => {
      console.log('📨 Received message:', data)
      handleIncomingMessage(data)
    })

    // Typing events
    socket.on('typing', ({ from }: { from: string }) => {
      console.log('⌨️ User started typing:', from)
      setTyping(from, true)
    })

    socket.on('stop_typing', ({ from }: { from: string }) => {
      console.log('⌨️ User stopped typing:', from)
      setTyping(from, false)
    })
  }

  const handleIncomingMessage = (data: any) => {
    if (!user?._id) return

    console.log('Processing incoming message:', data)

    // Handle different message formats
    let senderId, recipientId

    if (data.sender && typeof data.sender === 'object') {
      senderId = data.sender._id
    } else {
      senderId = data.sender
    }

    if (data.recipient && typeof data.recipient === 'object') {
      recipientId = data.recipient._id
    } else {
      recipientId = data.recipient
    }

    // Determine which peer this message belongs to
    const peerId = senderId === user._id ? recipientId : senderId
    console.log('Adding message to peer chat:', peerId)

    addMessage(peerId, {
      ...data,
      _id: data._id || data.id,
      sender: senderId,
      recipient: recipientId,
    })
  }

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('Disconnecting socket...')
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [])

  useEffect(() => {
    if (user?._id && token) {
      // Add a delay to ensure everything is ready
      const timer = setTimeout(() => {
        connect()
      }, 2000)

      return () => {
        clearTimeout(timer)
        disconnect()
      }
    } else {
      setIsConnected(false)
    }
  }, [user?._id, token, connect, disconnect])

  // Send message
  const sendMessage = useCallback(
    (recipientId: string, content: string) => {
      if (!socketRef.current?.connected) {
        console.warn(
          'Socket not connected, message will be sent via API only'
        )
        return
      }

      console.log('📤 Sending message via socket:', {
        to: recipientId,
        content,
      })

      // Try both event names
      socketRef.current.emit('private_message', {
        to: recipientId,
        content,
      })

      socketRef.current.emit('sendMessage', {
        recipientId,
        content,
      })
    },
    []
  )

  const startTyping = useCallback((peerId: string) => {
    if (!socketRef.current?.connected) return
    socketRef.current.emit('typing', peerId)
  }, [])

  const stopTyping = useCallback((peerId: string) => {
    if (!socketRef.current?.connected) return
    socketRef.current.emit('stop_typing', peerId)
  }, [])

  const markMessagesRead = useCallback((peerId: string) => {
    if (!socketRef.current?.connected) return
    socketRef.current.emit('mark_read', { peerId })
  }, [])

  return {
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    markMessagesRead,
  }
}

export default useSocket
