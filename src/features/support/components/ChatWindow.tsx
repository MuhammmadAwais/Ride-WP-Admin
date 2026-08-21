import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Phone, Video, Paperclip, Smile, Send, Mic } from 'lucide-react';
import { type ChatThread } from '../types/chatTypes';
import { MessageBubble } from './MessageBubble';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SafeImage } from '@/Components/common/SafeImage';
import { useChat } from '../context/ChatContext';

interface ChatWindowProps {
  activeThread: ChatThread | null;
  onBack: () => void;
  isHiddenOnMobile: boolean;
}

export function ChatWindow({ activeThread, onBack, isHiddenOnMobile }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage } = useChat();
  const threadMessages = React.useMemo(() => activeThread ? (messages[activeThread.id] || []) : [], [activeThread, messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [threadMessages, activeThread]);

  // Entrance animation for chat messages when user switches
  useGSAP(() => {
    if (activeThread && containerRef.current) {
      const bubbles = containerRef.current.querySelectorAll('.message-bubble-wrapper');
      gsap.fromTo(bubbles, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [activeThread?.id]);

  if (!activeThread) {
    return (
      <div className={`flex-1 hidden md:flex flex-col items-center justify-center relative bg-main-bg`}>
        {/* Custom Geometric Wallpaper */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.04] dark:opacity-[0.08]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons-empty" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <path d="M25,0 L50,14.5 L50,43.4 L25,57.9 L0,43.4 L0,14.5 Z" stroke="currentColor" strokeWidth="1" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons-empty)" className="text-text-main" />
          </svg>
        </div>
        <div className="z-10 text-center">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
             <img src="/integri-logo.svg" alt="App Logo" className="w-10 h-10 opacity-50 grayscale" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          <h2 className="text-2xl font-poppins font-bold text-text-main mb-2">App Support Hub</h2>
          <p className="text-text-muted font-roboto text-sm max-w-md mx-auto">
            Select a conversation to start helping your users with their app experience.
          </p>
        </div>
      </div>
    );
  }

  const name = activeThread.isGroup ? activeThread.title || activeThread.ride?.rideName : activeThread.otherUser?.fullName;
  const avatar = activeThread.otherUser?.profileImage;

  return (
    <div 
      className={`absolute md:relative z-10 top-0 bottom-0 right-0 w-full md:flex-1 flex flex-col bg-main-bg transition-transform duration-300 ${
        isHiddenOnMobile ? 'translate-x-full md:translate-x-0' : 'translate-x-0'
      }`}
    >
      {/* Custom Geometric Wallpaper */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.04] dark:opacity-[0.08]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons-active" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
              <path d="M25,0 L50,14.5 L50,43.4 L25,57.9 L0,43.4 L0,14.5 Z" stroke="currentColor" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons-active)" className="text-text-main" />
        </svg>
      </div>

      {/* Sticky Header */}
      <div className="relative z-10 h-16 px-4 py-2 border-b border-border dark:border-white/5 bg-surface/80 backdrop-blur-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-accent/10 text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative">
            <SafeImage 
              src={avatar} 
              alt={name || 'Unknown'} 
              className="w-10 h-10 rounded-full object-cover bg-main-bg" 
              fallback={<div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">{name?.charAt(0) || '?'}</div>}
            />
          </div>
          
          <div className="flex flex-col">
            <h3 className="font-poppins font-bold text-[15px] text-text-main leading-none">
              {name || 'Unknown'}
            </h3>
            <span className="font-roboto text-[12px] text-text-muted mt-1 leading-none">
              {activeThread.isGroup ? 'Group Chat' : 'Direct Message'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2.5 rounded-full hover:bg-accent/10 text-text-muted hover:text-accent transition-colors hidden sm:block">
            <Video size={18} />
          </button>
          <button className="p-2.5 rounded-full hover:bg-accent/10 text-text-muted hover:text-accent transition-colors hidden sm:block">
            <Phone size={18} />
          </button>
          <div className="w-px h-5 bg-border mx-1 hidden sm:block" />
          <button className="p-2.5 rounded-full hover:bg-accent/10 text-text-muted hover:text-accent transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div 
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex flex-col"
      >
        <div className="text-center my-4">
          <span className="inline-block px-3 py-1 bg-surface border border-border dark:border-white/5 rounded-lg text-[11px] font-roboto font-medium text-text-muted shadow-sm">
            {new Date(activeThread.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {threadMessages.map((msg) => (
          <div key={msg.id} className="message-bubble-wrapper">
            <MessageBubble message={msg as any} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="relative z-10 p-3 sm:p-4 bg-surface/80 backdrop-blur-xl border-t border-border dark:border-white/5">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-main-bg border border-border dark:border-white/5 rounded-2xl p-2 shadow-sm focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
          <button className="p-2 text-text-muted hover:text-accent transition-colors flex-shrink-0">
            <Smile size={22} />
          </button>
          <button className="p-2 text-text-muted hover:text-accent transition-colors flex-shrink-0">
            <Paperclip size={22} />
          </button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[40px] py-2.5 text-[15px] font-roboto text-text-main placeholder:text-text-muted/50 custom-scrollbar"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputText.trim()) {
                  sendMessage(activeThread.id, inputText.trim());
                  setInputText('');
                }
              }
            }}
          />
          
          {inputText.trim() ? (
            <button 
              onClick={() => {
                sendMessage(activeThread.id, inputText.trim());
                setInputText('');
              }}
              className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center flex-shrink-0 hover:bg-accent/90 transition-colors shadow-md shadow-accent/20 mb-0.5 mr-0.5"
            >
              <Send size={18} className="ml-1" />
            </button>
          ) : (
            <button className="p-2 text-text-muted hover:text-accent transition-colors flex-shrink-0 mb-0.5 mr-0.5">
              <Mic size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
