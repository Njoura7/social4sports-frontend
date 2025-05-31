export interface Message {
  _id: string
  sender: string // 'me' for current user or peerId
  recipient?: string
  content: string
  createdAt: string // ISO string
  readAt?: string // ISO string
  isOptimistic?: boolean
}
