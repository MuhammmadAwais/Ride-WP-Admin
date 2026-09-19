import React from 'react';
import { type SupportMessage } from '../types/chatTypes';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: SupportMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  // PDF 3: senderType is explicitly 'admin' or 'user'
  const isOutgoing = message.senderType === 'admin';

  // Status Icon logic
  const renderStatus = () => {
    if (!isOutgoing) return null;
    if (message.isRead) return <CheckCheck size={14} className="text-blue-300 ml-1 inline" />;
    return <Check size={14} className="text-white/70 ml-1 inline" />;
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative group ${
          isOutgoing
            ? 'bg-accent text-white rounded-tr-sm'
            : 'bg-surface text-text-main rounded-tl-sm border border-border dark:border-white/10'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-1">
          <span
            className={`text-[10px] font-poppins font-bold uppercase tracking-wider ${
              isOutgoing ? 'text-white/80' : 'text-accent'
            }`}
          >
            {isOutgoing ? 'Support Staff (You)' : 'User'}
          </span>
        </div>

        <p className="text-[14px] font-roboto leading-relaxed whitespace-pre-wrap">
          {message.message}
        </p>

        {/* Footer (Timestamp + Status) */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 font-roboto text-[10px] ${
            isOutgoing ? 'text-white/80' : 'text-text-muted'
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}

