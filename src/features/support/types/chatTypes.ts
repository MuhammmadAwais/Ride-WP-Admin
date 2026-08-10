/**
 * @fileoverview Domain models and types for the Support Chat system using Socket.io
 */

export interface ChatUser {
  id: number;
  fullName: string;
  profileImage: string | null;
}

export interface ChatThread {
  id: number;
  type: "direct" | "activity";
  userOneId?: number | null;
  userTwoId?: number | null;
  rideId?: number | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  isGroup?: boolean;
  title?: string;
  otherUser?: ChatUser | null;
  ride?: {
    id: number;
    rideName: string;
    clubId: number | null;
    userId: number;
  } | null;
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
}

export interface ChatMessage {
  id: number;
  threadId: number;
  senderId: number;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sender: ChatUser;
}

export interface SocketAck<T = any> {
  ok: boolean;
  data?: T;
  message?: string;
}

export interface ThreadsListResponse {
  count: number;
  totalUnreadCount: number;
  rows: ChatThread[];
}

export interface MessagesListResponse {
  count: number;
  rows: ChatMessage[];
}
