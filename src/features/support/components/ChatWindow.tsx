import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Headphones, Paperclip, Smile, Send, ShieldCheck, Mail } from 'lucide-react';
import { type SupportThread } from '../types/chatTypes';
import { MessageBubble } from './MessageBubble';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SafeImage } from '@/Components/common/SafeImage';
import { useChat } from '../context/ChatContext';

interface ChatWindowProps {
  activeThread: SupportThread | null;
  onBack: () => void;
  isHiddenOnMobile: boolean;
}

export function ChatWindow({ activeThread, onBack, isHiddenOnMobile }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat();
  const threadMessages = React.useMemo(
    () => (activeThread ? messages[activeThread.id] || [] : []),
    [activeThread, messages]
  );

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [threadMessages, activeThread]);

  // Entrance animation for chat messages when switching
  useGSAP(() => {
    if (activeThread && containerRef.current) {
      const bubbles = containerRef.current.querySelectorAll('.message-bubble-wrapper');
      gsap.fromTo(
        bubbles,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [activeThread?.id]);

  const handleSend = async () => {
    if (!activeThread || !inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    await sendMessage(activeThread.id, text);
  };

  if (!activeThread) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center relative bg-main-bg p-8">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons-empty" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <path d="M25,0 L50,14.5 L50,43.4 L25,57.9 L0,43.4 L0,14.5 Z" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons-empty)" className="text-text-main" />
          </svg>
        </div>

        <div className="z-10 text-center max-w-md">
          <div className="w-18 h-18 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-border text-accent">
            <Headphones size={36} />
          </div>
          <h2 className="text-2xl font-poppins font-bold text-text-main mb-2">
            App Support Helpdesk
          </h2>
          <p className="text-text-muted font-roboto text-sm leading-relaxed">
            Select a support inquiry from the left panel to inspect user questions, auto-claim tickets, and send real-time replies.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Support Socket Gateway Connected
          </div>
        </div>
      </div>
    );
  }

  const name = activeThread.user?.fullName || activeThread.otherUser?.fullName || `User #${activeThread.userId}`;
  const avatar = activeThread.user?.profileImage || activeThread.otherUser?.profileImage;
  const email = activeThread.user?.email;
  const isTicketOpen = (activeThread.status || 'open').toLowerCase() === 'open';

  return (
    <div
      className={`absolute md:relative z-10 top-0 bottom-0 right-0 w-full md:flex-1 flex flex-col bg-main-bg transition-transform duration-300 ${
        isHiddenOnMobile ? 'translate-x-full md:translate-x-0' : 'translate-x-0'
      }`}
    >
      {/* Sticky Header with Ticket Metadata */}
      <div className="relative z-10 h-18 px-4 sm:px-6 border-b border-border bg-surface/90 backdrop-blur-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 rounded-xl hover:bg-accent/10 text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative shrink-0">
            <SafeImage
              src={avatar}
              alt={name}
              className="w-11 h-11 rounded-2xl object-cover bg-main-bg border border-border shadow-xs"
              fallback={
                <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-black text-accent font-poppins shadow-xs">
                  {name.charAt(0)}
                </div>
              }
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-poppins font-bold text-[15px] text-text-main truncate leading-tight">
                {name}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-main-bg border border-border text-text-muted font-bold shrink-0">
                #TKT-{activeThread.id}
              </span>
            </div>

            {email && (
              <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-roboto mt-0.5 truncate">
                <Mail size={12} className="shrink-0 text-accent/80" />
                <span className="truncate">{email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Status & Assignment Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border shadow-xs ${
              isTicketOpen
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isTicketOpen ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            {activeThread.status || 'open'}
          </span>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-main-bg border border-border text-text-muted text-xs font-semibold">
            <ShieldCheck size={14} className="text-accent" />
            <span>Admin Desk</span>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar flex flex-col"
      >
        <div className="text-center my-3">
          <span className="inline-block px-3.5 py-1 bg-surface/80 border border-border rounded-full text-[11px] font-roboto font-medium text-text-muted shadow-xs">
            Ticket opened • {new Date(activeThread.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(activeThread.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {threadMessages.map((msg) => (
          <div key={msg.id} className="message-bubble-wrapper">
            <MessageBubble message={msg} showSenderLabel={false} />
          </div>
        ))}

        {threadMessages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="font-roboto text-sm text-text-muted">
              No previous messages recorded in this support session.
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Modern Floating Input Bar */}
      <div className="relative z-10 p-3 sm:p-4 bg-surface/90 backdrop-blur-xl border-t border-border">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-main-bg border border-border rounded-2xl p-2 shadow-xs focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
          <button
            type="button"
            className="p-2 text-text-muted hover:text-accent transition-colors flex-shrink-0 cursor-pointer"
            title="Insert emoji"
          >
            <Smile size={20} />
          </button>
          <button
            type="button"
            className="p-2 text-text-muted hover:text-accent transition-colors flex-shrink-0 cursor-pointer"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type support reply to ${name}...`}
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[40px] py-2 text-[14px] font-roboto text-text-main placeholder:text-text-muted/50 no-scrollbar"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all mb-0.5 mr-0.5 cursor-pointer ${
              inputText.trim()
                ? 'bg-accent text-white hover:bg-accent/90 shadow-[0_4px_14px_-2px_rgba(235,113,43,0.4)] hover:scale-105 active:scale-95'
                : 'bg-surface text-text-muted/40 cursor-not-allowed border border-border/40'
            }`}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

