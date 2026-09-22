/**
 * @fileoverview Live Athlete Helpdesk Feed for the Admin Dashboard.
 * Connects directly to Socket.io ChatContext to show real-time incoming athlete tickets,
 * unread message indicators, assigned status, and one-click launch to the Support Desk.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowUpRight, Clock, UserCheck, AlertCircle, ShieldCheck } from 'lucide-react';
import { useChat } from '@/features/support/context/ChatContext';
import { SafeImage } from '@/Components/common/SafeImage';
import { ROUTES } from '@/Constants';

export default function LiveInquiriesTerminal() {
  const navigate = useNavigate();
  const { threads, unreadCount, openTicketsCount, setActiveThreadId } = useChat();

  const handleOpenTicket = (threadId: number) => {
    setActiveThreadId(threadId);
    navigate(ROUTES.APP_SUPPORT);
  };

  const displayThreads = threads.slice(0, 5);

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Just now';
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Yesterday';
      return `${diffInDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between h-[440px] shadow-sm relative overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-text-main text-base tracking-tight">
                Live Helpdesk Feed
              </h3>
              <p className="font-roboto text-text-muted text-xs">
                Real-time athlete support inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-poppins font-bold bg-accent/15 text-accent border border-accent/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {unreadCount} Unread
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-poppins font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Socket
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Ticket List ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pr-1 my-3.5 space-y-2.5 custom-scrollbar">
        {displayThreads.length > 0 ? (
          displayThreads.map((thread) => {
            const userName = thread.user?.fullName || thread.otherUser?.fullName || `User #${thread.userId}`;
            const userAvatar = thread.user?.profileImage || thread.otherUser?.profileImage || undefined;
            const messagePreview = thread.lastMessage?.message || 'New help inquiry received';
            const isUnread = (thread.unreadCount || 0) > 0;
            const status = (thread.status || 'open').toLowerCase();

            return (
              <div
                key={thread.id}
                onClick={() => handleOpenTicket(thread.id)}
                className={`group p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isUnread
                    ? 'bg-accent/5 border-accent/30 hover:border-accent'
                    : 'bg-main-bg/50 border-border/80 hover:border-accent/40 hover:bg-main-bg'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SafeImage
                      src={userAvatar}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                      fallback={
                        <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-poppins font-bold shrink-0">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      }
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-poppins text-xs font-bold text-text-main truncate group-hover:text-accent transition-colors">
                          {userName}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-ping" />
                        )}
                      </div>
                      <p className="font-roboto text-[11px] text-text-muted truncate">
                        {thread.user?.email || thread.otherUser?.email || `Ticket #${thread.id}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-poppins font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                        status === 'open'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : status === 'assigned'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {status}
                    </span>
                    <span className="font-roboto text-[11px] text-text-muted flex items-center gap-1">
                      <Clock size={11} className="text-text-muted/70" />
                      {formatRelativeTime(thread.lastMessageAt || thread.updatedAt)}
                    </span>
                  </div>
                </div>

                <p className="font-roboto text-xs text-text-muted group-hover:text-text-main transition-colors line-clamp-1 pl-10.5">
                  "{messagePreview}"
                </p>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-poppins font-bold text-text-main text-sm">Helpdesk All Clear</h4>
            <p className="font-roboto text-text-muted text-xs mt-1 max-w-[240px]">
              No active open support inquiries. All athlete conversations are resolved.
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="border-t border-border pt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs font-roboto text-text-muted">
          <span className="flex items-center gap-1.5">
            <AlertCircle size={13} className="text-amber-400" />
            <span><strong className="text-text-main font-poppins">{openTicketsCount}</strong> Open</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1.5">
            <UserCheck size={13} className="text-blue-400" />
            <span><strong className="text-text-main font-poppins">{threads.length}</strong> Total</span>
          </span>
        </div>

        <button
          onClick={() => navigate(ROUTES.APP_SUPPORT)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface border border-border hover:border-accent hover:text-accent text-text-main text-xs font-poppins font-semibold transition-all cursor-pointer group"
        >
          <span>Support Desk</span>
          <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
