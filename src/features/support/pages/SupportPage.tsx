import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/Constants';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { MOCK_CHAT_USERS, MOCK_MESSAGES } from '../utils/constants';

export default function SupportPage() {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const handleSelectUser = (id: string | null) => {
    setActiveUserId(id);
  };

  const handleBackToSidebar = () => {
    setActiveUserId(null);
  };

  // Mobile layout state flags
  // isChatActive determines if the chat window should take full width on mobile
  const isChatActive = activeUserId !== null;

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-160px)] min-h-[500px]">
      <Helmet>
        <title>App Support — {APP_NAME} Admin</title>
      </Helmet>

      {/* Main Container: Dual-Pane Grid architecture */}
      <div className="flex-1 bg-surface border border-border dark:border-white/5 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden flex relative">
        
        {/* Left Panel: Chat List */}
        <ChatSidebar 
          users={MOCK_CHAT_USERS}
          activeUserId={activeUserId}
          onSelectUser={handleSelectUser}
          isHiddenOnMobile={isChatActive}
        />

        {/* Right Panel: Chat Window */}
        <ChatWindow 
          activeUser={activeUserId ? MOCK_CHAT_USERS.find(u => u.id === activeUserId) || null : null}
          messages={activeUserId && MOCK_MESSAGES[activeUserId] ? MOCK_MESSAGES[activeUserId] : []}
          onBack={handleBackToSidebar}
          isHiddenOnMobile={!isChatActive}
        />

      </div>
    </div>
  );
}
