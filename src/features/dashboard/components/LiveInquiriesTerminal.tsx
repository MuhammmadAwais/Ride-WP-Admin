import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowUpRight, Clock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useChat } from '@/features/support/context/ChatContext';
import { SafeImage } from '@/Components/common/SafeImage';

export default function LiveInquiriesTerminal() {
  const navigate = useNavigate();
  const { threads, unreadCount, openTicketsCount, setActiveThreadId } = useChat();

  const handleOpenTicket = (threadId: number) => {
    setActiveThreadId(threadId);
    navigate('/support');
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
      return `${Math.floor(diffInHours / 24)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between h-[420px] shadow-sm relative overflow-hidden">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EB712B]/10 text-[#EB712B] flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">
                Live Helpdesk Feed
              </h3>
              <p className="font-roboto text-text-muted text-xs">Real-time socket support inquiries</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EB712B]/10 text-[#EB712B] border border-[#EB712B]/20 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EB712B]" />
                {unreadCount} Unread
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Socket
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-2.5 custom-scrollbar">
        {displayThreads.length > 0 ? (
          displayThreads.map((thread) => {
            const userName = thread.user?.fullName || thread.otherUser?.fullName || `User #${thread.userId}`;
            const userAvatar = thread.user?.profileImage || thread.otherUser?.profileImage || undefined;
            const messagePreview = thread.lastMessage?.message || 'New help inquiry received';
            const isUnread = (thread.unreadCount || 0) > 0;
            const status = thread.status || 'open';

            return (
              <div
                key={thread.id}
                onClick={() => handleOpenTicket(thread.id)}
                className={`group p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isUnread
                    ? 'bg-[#EB712B]/5 border-[#EB712B]/30 hover:border-[#EB712B]'
                    : 'bg-main-bg/40 border-border/60 hover:border-text-muted/40 hover:bg-main-bg/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SafeImage
                      src={userAvatar}
                      alt={userName}
                      className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                      fallback={
                        <div className="w-7 h-7 rounded-full bg-[#EB712B]/15 text-[#EB712B] flex items-center justify-center text-[11px] font-bold shrink-0">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      }
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-poppins text-xs font-bold text-text-main truncate group-hover:text-[#EB712B] transition-colors">
                          {userName}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#EB712B] shrink-0" />
                        )}
                      </div>
                      <p className="font-roboto text-[10px] text-text-muted truncate">
                        {thread.user?.email || `Ticket #${thread.id}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        status === 'open'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : status === 'assigned'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {status}
                    </span>
                    <span className="font-roboto text-[10px] text-text-muted flex items-center gap-1">
                      <Clock size={10} />
                      {formatRelativeTime(thread.lastMessageAt || thread.updatedAt)}
                    </span>
                  </div>
                </div>

                <p className="font-roboto text-xs text-text-muted/90 line-clamp-1 group-hover:text-text-main transition-colors pl-9">
                  "{messagePreview}"
                </p>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <ShieldCheck size={22} />
            </div>
            <h4 className="font-poppins font-bold text-text-main text-sm">Inbox Zero Achieved</h4>
            <p className="font-roboto text-text-muted text-xs mt-1 max-w-[220px]">
              All member tickets and questions are currently resolved or assigned.
            </p>
          </div>
        )}
      </div>

      {/* Footer / Quick Launch */}
      <div className="border-t border-border pt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
          <span className="flex items-center gap-1">
            <AlertCircle size={12} className="text-amber-500" />
            <strong className="text-text-main">{openTicketsCount}</strong> Open
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <UserCheck size={12} className="text-blue-500" />
            <strong className="text-text-main">{threads.length}</strong> Total
          </span>
        </div>

        <button
          onClick={() => navigate('/support')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-[#EB712B] hover:text-[#EB712B] text-text-main text-xs font-semibold transition-all duration-200"
        >
          <span>Support Desk</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}
