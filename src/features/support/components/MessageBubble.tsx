import React from 'react';
import { type SupportMessage } from '../types/chatTypes';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: SupportMessage;
  showSenderLabel?: boolean;
}

export function MessageBubble({ message, showSenderLabel = false }: MessageBubbleProps) {
  const isOutgoing = message.senderType === 'admin';

  const renderStatus = () => {
    if (!isOutgoing) return null;
    if (message.isRead) {
      return <CheckCheck size={13} className="text-white/90 shrink-0" />;
    }
    return <Check size={13} className="text-white/60 shrink-0" />;
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'} mb-2.5 group`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 relative transition-all shadow-xs ${
          isOutgoing
            ? 'bg-gradient-to-br from-accent to-[#d45e1b] text-white rounded-br-xs shadow-[0_4px_14px_-3px_rgba(235,113,43,0.35)]'
            : 'bg-surface text-text-main rounded-bl-xs border border-border/80 shadow-xs'
        }`}
      >
        {showSenderLabel && (
          <div className="flex items-center justify-between gap-3 mb-1">
            <span
              className={`text-[10px] font-poppins font-black uppercase tracking-wider ${
                isOutgoing ? 'text-white/80' : 'text-accent'
              }`}
            >
              {isOutgoing ? 'Admin Desk' : 'Athlete'}
            </span>
          </div>
        )}

        <p className="text-[13.5px] sm:text-[14px] font-roboto leading-relaxed whitespace-pre-wrap break-words">
          {message.message}
        </p>

        {/* Footer (Timestamp + Status) */}
        <div
          className={`flex items-center justify-end gap-1 mt-1.5 font-roboto text-[10px] select-none ${
            isOutgoing ? 'text-white/75' : 'text-text-muted'
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}


