/**
 * @fileoverview Domain models and types for the App Support Helpdesk Socket system.
 * Strictly adheres to "App Support Socket Chat Integration Documentation" (PDF 3).
 */

export type TicketStatus = 'open' | 'assigned' | 'resolved' | string;
export type SenderType = 'user' | 'admin';

export interface SupportUser {
  id: number;
  fullName: string;
  email?: string;
  profileImage: string | null;
}

export interface SupportMessage {
  id: number;
  threadId: number;
  senderId: number;
  senderType: SenderType;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SupportThread {
  id: number;
  userId: number;
  adminId: number | null;
  status: TicketStatus;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  user: SupportUser;
  lastMessage?: {
    id?: number;
    message: string;
    createdAt: string;
    senderType?: SenderType;
  } | null;
  unreadCount?: number;
  // Backward compatibility convenience fields
  otherUser?: SupportUser | null;
  title?: string;
  isGroup?: boolean;
}

export interface SocketAck<T = unknown> {
  ok: boolean;
  data?: T;
  message?: string;
}

export interface ThreadsListResponse {
  count: number;
  totalUnreadCount?: number;
  rows: SupportThread[];
}

export interface MessagesListResponse {
  count: number;
  rows: SupportMessage[];
}

// Aliases for seamless backward compatibility across UI components
export type ChatUser = SupportUser;
export type ChatThread = SupportThread;
export type ChatMessage = SupportMessage;

