import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { type ChatUser } from '../utils/constants';

interface ChatSidebarProps {
  users: ChatUser[];
  activeUserId: string | null;
  onSelectUser: (id: string | null) => void;
  isHiddenOnMobile: boolean;
}

export function ChatSidebar({ users, activeUserId, onSelectUser, isHiddenOnMobile }: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Custom filter using standard substring
  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Highlights matches of the search term within the given text.
   * Uses the Red-Highlight utility as requested.
   */
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight || !highlight.trim()) {
      return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-red-500/20 text-red-200 px-0.5 rounded-sm bg-transparent font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div 
      className={`absolute md:relative z-20 top-0 bottom-0 left-0 w-full md:w-[360px] flex flex-col border-r border-border dark:border-white/5 backdrop-blur-xl bg-white/5 transition-transform duration-300 ${
        isHiddenOnMobile ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
      }`}
    >
      {/* Header & Search */}
      <div className="p-4 border-b border-border dark:border-white/5">
        <button 
          onClick={() => onSelectUser(null)}
          className="w-full text-left font-poppins font-bold text-xl text-text-main mb-4 px-2 hover:text-accent transition-colors"
        >
          Messages
        </button>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-accent">
            <Search size={16} className="text-text-muted/50 group-focus-within:text-accent" />
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border dark:border-white/5 text-text-main text-sm rounded-full pl-10 pr-4 py-2 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-muted/40 shadow-sm"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {filteredUsers.map((user) => {
          const isActive = user.id === activeUserId;
          return (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`w-full p-4 flex items-center gap-3 transition-colors border-b border-border/50 dark:border-white/[0.02] ${
                isActive ? 'bg-accent/10 dark:bg-accent/5' : 'hover:bg-surface'
              }`}
            >
              {/* Avatar & Online Indicator */}
              <div className="relative flex-shrink-0">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover bg-surface" />
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-main-bg" />
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`font-poppins font-semibold text-[15px] truncate ${isActive ? 'text-text-main' : 'text-text-main/90'}`}>
                    {renderHighlightedText(user.name, searchTerm)}
                  </h3>
                  <span className={`text-[11px] font-roboto whitespace-nowrap ml-2 ${isActive ? 'text-accent' : 'text-text-muted'}`}>
                    {user.lastMessageTime}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="font-roboto text-[13px] text-text-muted truncate">
                    {renderHighlightedText(user.lastMessage, searchTerm)}
                  </p>
                  {user.unreadCount > 0 && (
                    <div className="flex-shrink-0 min-w-[20px] h-5 rounded-full bg-accent flex items-center justify-center px-1.5 shadow-sm shadow-accent/20">
                      <span className="text-[10px] font-bold text-white leading-none mt-[1px]">
                        {user.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-text-muted font-roboto text-sm">
            No matches found.
          </div>
        )}
      </div>
    </div>
  );
}
