import React from 'react';
import { type ChatMessage } from '../types/chatTypes';
import { Check, CheckCheck } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const currentUserId = useAppSelector((state: any) => state.auth.user?.id);
  // Assuming if senderId is the current user (admin), it's outgoing.
  // Or if it's undefined, we fallback to false.
  const isOutgoing = message.senderId === currentUserId;
  
  // Status Icon logic
  const renderStatus = () => {
    if (!isOutgoing) return null;
    if (message.isRead) return <CheckCheck size={14} className="text-blue-400 ml-1 inline" />;
    return <Check size={14} className="text-white/70 ml-1 inline" />;
  };

  const renderContent = () => {
    return (
      <p className="text-[15px] font-poppins leading-relaxed whitespace-pre-wrap">
        {message.message}
      </p>
    );
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative group ${
          isOutgoing 
            ? 'bg-[#EB712B] text-white rounded-tr-sm' 
            : 'bg-surface text-text-main rounded-tl-sm border border-border dark:border-white/5'
        }`}
      >
        {renderContent()}

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
