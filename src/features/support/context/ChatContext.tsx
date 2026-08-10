import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getSocket, initializeSocket, disconnectSocket } from '../api/socket';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { ChatThread, ChatMessage, SocketAck, ThreadsListResponse, MessagesListResponse } from '../types/chatTypes';

interface ChatContextType {
  threads: ChatThread[];
  messages: Record<number, ChatMessage[]>;
  activeThreadId: number | null;
  setActiveThreadId: (id: number | null) => void;
  sendMessage: (threadId: number, message: string) => void;
  loadMessages: (threadId: number, offset?: number) => void;
  unreadCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state: any) => state.auth.token);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    const socket = initializeSocket(token);

    // Initial fetch
    socket.emit('chat:threads:list', { limit: 50, offset: 0 }, (response: SocketAck<ThreadsListResponse>) => {
      if (response.ok && response.data) {
        setThreads(response.data.rows);
        setUnreadCount(response.data.totalUnreadCount);
      }
    });

    // Subscriptions
    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => ({
        ...prev,
        [msg.threadId]: [...(prev[msg.threadId] || []), msg]
      }));

      // Update thread lastMessage & unread count
      setThreads((prev) => prev.map((thread) => {
        if (thread.id === msg.threadId) {
          return {
            ...thread,
            lastMessage: msg,
            lastMessageAt: msg.createdAt,
            unreadCount: (thread.id === activeThreadId) ? 0 : (thread.unreadCount || 0) + 1
          };
        }
        return thread;
      }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()));
    };

    const handleThreadRead = ({ threadId }: { threadId: number }) => {
      setThreads((prev) => prev.map((thread) => 
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
      ));
    };

    socket.on('chat:message:new', handleNewMessage);
    socket.on('chat:thread:read', handleThreadRead);

    return () => {
      socket.off('chat:message:new', handleNewMessage);
      socket.off('chat:thread:read', handleThreadRead);
    };
  }, [token, activeThreadId]);

  // Load messages for a thread
  const loadMessages = useCallback((threadId: number, offset = 0) => {
    const socket = getSocket();
    if (!socket) return;
    
    // Join thread room if it's new
    socket.emit('chat:thread:join', { threadId });

    socket.emit('chat:messages:list', { threadId, limit: 50, offset }, (response: SocketAck<MessagesListResponse>) => {
      if (response.ok && response.data) {
        // Reverse array because chat usually renders newest at bottom
        const sortedMsgs = response.data.rows.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages((prev) => ({
          ...prev,
          [threadId]: offset === 0 ? sortedMsgs : [...sortedMsgs, ...(prev[threadId] || [])]
        }));
      }
    });

    // Mark as read
    socket.emit('chat:thread:read', { threadId });
  }, []);

  useEffect(() => {
    if (activeThreadId) {
      loadMessages(activeThreadId);
    }
  }, [activeThreadId, loadMessages]);

  const sendMessage = useCallback((threadId: number, message: string) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('chat:message:send', { threadId, message }, (response: SocketAck) => {
      if (response.ok) {
        console.log('Message sent successfully');
      }
    });
  }, []);

  return (
    <ChatContext.Provider value={{ threads, messages, activeThreadId, setActiveThreadId, sendMessage, loadMessages, unreadCount }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
