import React, { useState, useMemo } from 'react';
import { Search, Headphones } from 'lucide-react';
import { type SupportThread } from '../types/chatTypes';
import { SafeImage } from '@/Components/common/SafeImage';

interface ChatSidebarProps {
  threads: SupportThread[];
  activeThreadId: number | null;
  onSelectThread: (id: number | null) => void;
  isHiddenOnMobile: boolean;
}

export function ChatSidebar({ threads, activeThreadId, onSelectThread, isHiddenOnMobile }: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'assigned'>('all');

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      // Status filter
      if (statusFilter !== 'all') {
        const status = (t.status || 'open').toLowerCase();
        if (status !== statusFilter) return false;
      }

      // Search filter
      const name = t.user?.fullName || t.otherUser?.fullName || `User #${t.userId}`;
      const email = t.user?.email || '';
      const msg = t.lastMessage?.message || '';
      const query = searchTerm.toLowerCase().trim();

      if (!query) return true;

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        msg.toLowerCase().includes(query)
      );
    });
  }, [threads, searchTerm, statusFilter]);

  const renderHighlightedText = (text: string, highlight: string) => {
    if (!text) return null;
    if (!highlight || !highlight.trim()) {
      return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-red-500/20 text-red-400 px-0.5 rounded-sm font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`absolute md:relative z-20 top-0 bottom-0 left-0 w-full md:w-[360px] flex flex-col border-r border-border dark:border-white/5 backdrop-blur-xl bg-surface/50 transition-transform duration-300 ${
        isHiddenOnMobile ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
      }`}
    >
      {/* Header & Search */}
      <div className="p-4 border-b border-border dark:border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Headphones size={18} />
            </div>
            <div>
              <h2 className="font-poppins font-bold text-lg text-text-main leading-none">
                Support Tickets
              </h2>
              <span className="font-roboto text-[11px] text-text-muted">
                {threads.length} active inquiries
              </span>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-accent">
            <Search size={15} className="text-text-muted/50 group-focus-within:text-accent" />
          </div>
          <input
            type="text"
            placeholder="Search tickets by user or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-main-bg border border-border dark:border-white/5 text-text-main text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-muted/50"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {(['all', 'open', 'assigned'] as const).map((tab) => {
            const count =
              tab === 'all'
                ? threads.length
                : threads.filter((t) => (t.status || 'open').toLowerCase() === tab).length;
            const isActive = statusFilter === tab;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-poppins font-medium capitalize transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-surface hover:bg-main-bg text-text-muted hover:text-text-main border border-border/50'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-border/60 text-text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar divide-y divide-border/40">
        {filteredThreads.map((thread) => {
          const isActive = thread.id === activeThreadId;
          const name = thread.user?.fullName || thread.otherUser?.fullName || `User #${thread.userId}`;
          const avatar = thread.user?.profileImage || thread.otherUser?.profileImage;
          const email = thread.user?.email || '';
          const msg = thread.lastMessage?.message || 'No messages yet';
          const isTicketOpen = (thread.status || 'open').toLowerCase() === 'open';

          return (
            <button
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={`w-full p-3.5 flex items-start gap-3 transition-colors text-left ${
                isActive ? 'bg-accent/10 dark:bg-accent/5' : 'hover:bg-surface/80'
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0 mt-0.5">
                <SafeImage
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover bg-surface border border-border"
                  fallback={
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                      {name?.charAt(0) || '?'}
                    </div>
                  }
                />
              </div>

              {/* Info Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3
                    className={`font-poppins font-semibold text-[14px] truncate ${
                      isActive ? 'text-text-main' : 'text-text-main/90'
                    }`}
                  >
                    {renderHighlightedText(name, searchTerm)}
                  </h3>
                  <span
                    className={`text-[10px] font-roboto whitespace-nowrap ml-1 ${
                      isActive ? 'text-accent' : 'text-text-muted'
                    }`}
                  >
                    {formatTime(thread.lastMessageAt || thread.createdAt)}
                  </span>
                </div>

                {email && (
                  <p className="text-[11px] text-text-muted truncate mb-1">
                    {renderHighlightedText(email, searchTerm)}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2">
                  <p className="font-roboto text-[12px] text-text-muted truncate flex-1">
                    {thread.lastMessage?.senderType === 'admin' && (
                      <span className="text-accent font-medium mr-1">You:</span>
                    )}
                    {renderHighlightedText(msg, searchTerm)}
                  </p>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                        isTicketOpen
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}
                    >
                      {thread.status || 'open'}
                    </span>

                    {(thread.unreadCount || 0) > 0 && (
                      <div className="min-w-[18px] h-4.5 rounded-full bg-accent flex items-center justify-center px-1 shadow-sm shadow-accent/20">
                        <span className="text-[10px] font-bold text-white leading-none">
                          {thread.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filteredThreads.length === 0 && (
          <div className="p-8 text-center text-text-muted font-roboto text-sm">
            No support tickets found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

