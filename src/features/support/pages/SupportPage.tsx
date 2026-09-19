import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/Constants';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { ChatProvider, useChat } from '../context/ChatContext';

function SupportChatContent() {
  const { threads, activeThreadId, setActiveThreadId } = useChat();
  
  const handleSelectThread = (id: number | null) => {
    setActiveThreadId(id);
  };

  const handleBackToSidebar = () => {
    setActiveThreadId(null);
  };

  // Mobile layout state flags
  const isChatActive = activeThreadId !== null;

  return (
    <div className="flex-1 bg-surface border border-border dark:border-white/5 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden flex relative">
      
      {/* Left Panel: Chat List */}
      <ChatSidebar 
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        isHiddenOnMobile={isChatActive}
      />

      {/* Right Panel: Chat Window */}
      <ChatWindow 
        activeThread={activeThreadId ? threads.find(t => t.id === activeThreadId) || null : null}
        onBack={handleBackToSidebar}
        isHiddenOnMobile={!isChatActive}
      />

    </div>
  );
}

export default function SupportPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-160px)] min-h-[500px]">
      <Helmet>
        <title>App Support — {APP_NAME} Admin</title>
      </Helmet>
      <SupportChatContent />
    </div>
  );
}

