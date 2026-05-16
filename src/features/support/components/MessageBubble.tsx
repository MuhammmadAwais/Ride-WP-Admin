import React, { useState } from 'react';
import { type ChatMessage } from '../utils/constants';
import { CustomAudioPlayer } from './CustomAudioPlayer';
import { Check, CheckCheck, PlayCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.senderId === 'me';
  
  // Status Icon logic
  const renderStatus = () => {
    if (!isOutgoing) return null;
    if (message.status === 'read') return <CheckCheck size={14} className="text-blue-400 ml-1 inline" />;
    if (message.status === 'delivered') return <CheckCheck size={14} className="text-white/70 ml-1 inline" />;
    return <Check size={14} className="text-white/70 ml-1 inline" />;
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <p className="text-[15px] font-poppins leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        );
      
      case 'image':
        return (
          <div className="relative rounded-xl overflow-hidden group cursor-pointer border border-white/10 mt-1 max-w-sm">
            <img 
              src={message.content} 
              alt="Sent image" 
              className="w-full h-auto aspect-video object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        );

      case 'video':
        return (
          <div className="relative rounded-xl overflow-hidden mt-1 max-w-sm bg-black/20 border border-white/10 group cursor-pointer">
            <video 
              src={message.content} 
              className="w-full h-auto aspect-video object-cover"
              controls
              controlsList="nodownload"
            />
          </div>
        );

      case 'audio':
        return (
          <div className="mt-1">
            <CustomAudioPlayer 
              src={message.content} 
              duration={message.duration} 
              isOutgoing={isOutgoing} 
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative group ${
          isOutgoing 
            ? 'bg-[#EB712B] text-white rounded-tr-sm' 
            : 'bg-[#282828E5] text-white/90 rounded-tl-sm dark:bg-surface border border-border dark:border-white/5'
        }`}
      >
        {/* Only show sender name if incoming and in a group chat context, but for support we assume 1-on-1, so omitted */}
        
        {renderContent()}

        {/* Footer (Timestamp + Status) */}
        <div 
          className={`flex items-center justify-end gap-1 mt-1 font-roboto text-[10px] ${
            isOutgoing ? 'text-white/80' : 'text-white/50 dark:text-text-muted'
          }`}
        >
          <span>{message.timestamp}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
