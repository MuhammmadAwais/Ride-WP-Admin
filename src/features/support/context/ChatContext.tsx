import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { getSocket, initializeSocket, disconnectSocket } from '../api/socket';
import { useAppSelector } from '@/hooks/useAppSelector';
import type {
  SupportThread,
  SupportMessage,
  SocketAck,
  ThreadsListResponse,
  MessagesListResponse,
} from '../types/chatTypes';

interface ChatContextType {
  threads: SupportThread[];
  messages: Record<number, SupportMessage[]>;
  activeThreadId: number | null;
  setActiveThreadId: (id: number | null) => void;
  sendMessage: (threadId: number, message: string) => Promise<boolean>;
  loadMessages: (threadId: number, offset?: number) => void;
  markAsRead: (threadId: number) => void;
  refreshThreads: () => void;
  unreadCount: number;
  openTicketsCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state: any) => state.auth.token);
  const currentAdmin = useAppSelector((state: any) => state.auth.user);
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [messages, setMessages] = useState<Record<number, SupportMessage[]>>({});
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const previousThreadIdRef = useRef<number | null>(null);

  const fetchThreads = useCallback(() => {
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    socket.emit(
      'support:threads:list',
      { limit: 50, offset: 0 },
      (response: SocketAck<ThreadsListResponse>) => {
        if (response?.ok && response?.data) {
          const list = response.data.rows || [];
          setThreads(list);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    const socket = initializeSocket(token);

    // Fetch initial tickets on connect or reconnection
    const handleConnect = () => {
      fetchThreads();
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on('connect', handleConnect);
    }

    // Listener 1: Real-time incoming message
    // PDF 3: payload is { threadId, message: { id, senderType, message, ... } }
    const handleNewMessage = (payload: any) => {
      const msg: SupportMessage = payload?.message || payload;
      const threadId: number = payload?.threadId || msg?.threadId;

      if (!threadId || !msg) return;

      setMessages((prev) => {
        const existing = prev[threadId] || [];
        // Avoid duplicate insertion
        if (existing.some((m) => m.id === msg.id)) {
          return prev;
        }
        return {
          ...prev,
          [threadId]: [...existing, msg],
        };
      });

      // Update the thread's last message, timestamp, and unread counter
      setThreads((prev) => {
        const index = prev.findIndex((t) => t.id === threadId);
        if (index === -1) {
          // If thread not in list yet, trigger full refresh
          fetchThreads();
          return prev;
        }

        const currentThread = prev[index];
        const isCurrentActive = threadId === activeThreadId;

        const updated: SupportThread = {
          ...currentThread,
          lastMessage: {
            id: msg.id,
            message: msg.message,
            createdAt: msg.createdAt,
            senderType: msg.senderType,
          },
          lastMessageAt: msg.createdAt,
          unreadCount: isCurrentActive ? 0 : (currentThread.unreadCount || 0) + 1,
        };

        const remaining = prev.filter((_, i) => i !== index);
        return [updated, ...remaining];
      });

      // Auto-mark as read if admin is actively viewing this thread
      if (threadId === activeThreadId) {
        socket.emit('support:thread:read', { threadId });
      }
    };

    // Listener 2: Read receipt broadcast
    // PDF 3: { threadId, readerId, role }
    const handleThreadRead = (payload: { threadId: number; readerId?: number; role?: string }) => {
      if (!payload?.threadId) return;
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === payload.threadId ? { ...thread, unreadCount: 0 } : thread
        )
      );
    };

    socket.on('support:message:new', handleNewMessage);
    socket.on('support:thread:read', handleThreadRead);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('support:message:new', handleNewMessage);
      socket.off('support:thread:read', handleThreadRead);
    };
  }, [token, activeThreadId, fetchThreads]);

  // Handle switching active thread: leave previous room and join new room
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const prevId = previousThreadIdRef.current;
    if (prevId && prevId !== activeThreadId) {
      socket.emit('support:thread:leave', { threadId: prevId });
    }

    if (activeThreadId) {
      // PDF 3: joining auto-claims the ticket if open (sets status: "assigned", adminId: currentAdmin.id)
      socket.emit('support:thread:join', { threadId: activeThreadId }, (response: SocketAck) => {
        if (response?.ok) {
          setThreads((prev) =>
            prev.map((t) =>
              t.id === activeThreadId
                ? {
                    ...t,
                    status: 'assigned',
                    adminId: currentAdmin?.id ?? t.adminId,
                    unreadCount: 0,
                  }
                : t
            )
          );
        }
      });

      // Mark read
      socket.emit('support:thread:read', { threadId: activeThreadId });
    }

    previousThreadIdRef.current = activeThreadId;
  }, [activeThreadId, currentAdmin?.id]);

  // Load message history for a specific support thread
  const loadMessages = useCallback((threadId: number, offset = 0) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit(
      'support:messages:list',
      { threadId, limit: 50, offset },
      (response: SocketAck<MessagesListResponse>) => {
        if (response?.ok && response?.data) {
          const rows = response.data.rows || [];
          // Sort oldest first for chronological chat view
          const sorted = [...rows].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          setMessages((prev) => ({
            ...prev,
            [threadId]: offset === 0 ? sorted : [...sorted, ...(prev[threadId] || [])],
          }));
        }
      }
    );
  }, []);

  // When activeThreadId changes, fetch message history
  useEffect(() => {
    if (activeThreadId) {
      loadMessages(activeThreadId);
    }
  }, [activeThreadId, loadMessages]);

  // Mark ticket as read manually
  const markAsRead = useCallback((threadId: number) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('support:thread:read', { threadId });
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  }, []);

  // Send an admin reply to the active thread
  const sendMessage = useCallback(
    (threadId: number, message: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const socket = getSocket();
        if (!socket || !message.trim()) {
          resolve(false);
          return;
        }

        socket.emit(
          'support:message:send',
          { threadId, message: message.trim() },
          (response: SocketAck<SupportMessage>) => {
            if (response?.ok && response?.data) {
              const newMsg = response.data;
              setMessages((prev) => ({
                ...prev,
                [threadId]: [...(prev[threadId] || []), newMsg],
              }));

              // Update thread snippet
              setThreads((prev) =>
                prev.map((t) =>
                  t.id === threadId
                    ? {
                        ...t,
                        lastMessage: {
                          id: newMsg.id,
                          message: newMsg.message,
                          createdAt: newMsg.createdAt,
                          senderType: 'admin',
                        },
                        lastMessageAt: newMsg.createdAt,
                        unreadCount: 0,
                      }
                    : t
                )
              );
              resolve(true);
            } else {
              resolve(false);
            }
          }
        );
      });
    },
    []
  );

  const totalUnreadCount = threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
  const openTicketsCount = threads.filter((t) => t.status === 'open').length;

  return (
    <ChatContext.Provider
      value={{
        threads,
        messages,
        activeThreadId,
        setActiveThreadId,
        sendMessage,
        loadMessages,
        markAsRead,
        refreshThreads: fetchThreads,
        unreadCount: totalUnreadCount,
        openTicketsCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const DEFAULT_CHAT_CONTEXT: ChatContextType = {
  threads: [],
  messages: {},
  activeThreadId: null,
  setActiveThreadId: () => {},
  sendMessage: async () => false,
  loadMessages: () => {},
  markAsRead: () => {},
  refreshThreads: () => {},
  unreadCount: 0,
  openTicketsCount: 0,
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    return DEFAULT_CHAT_CONTEXT;
  }
  return context;
};


