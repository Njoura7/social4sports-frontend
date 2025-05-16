
import { api } from "./api";

// Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

// Message services
export const messageService = {
  getContacts: () => 
    api.get<Contact[]>("/messages/contacts"),
  
  getConversation: (userId: string) => 
    api.get<Message[]>(`/messages/${userId}`),
  
  sendMessage: (receiverId: string, text: string) => 
    api.post<Message>(`/messages/${receiverId}`, { text }),
  
  markAsRead: (messageId: string) => 
    api.put(`/messages/${messageId}/read`),
};
