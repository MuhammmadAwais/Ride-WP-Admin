import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import { type ViewState, type TargetSegment, type RecipientUser } from '../types';
import CompositionPanel from '../components/CompositionPanel';
import PreviousNotifications from '../components/PreviousNotifications';
import RecipientSelector from '../components/RecipientSelector';

export default function NotificationPage() {
  const [view, setView] = useState<ViewState>('compose');
  
  // Shared Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetSegment, setTargetSegment] = useState<TargetSegment>('All Users');
  const [selectedUsers, setSelectedUsers] = useState<RecipientUser[]>([]);
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Transitions for view changes
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.2, ease: 'power1.inOut' }
      );
    }
  }, [view]);

  const handleOpenSelector = () => {
    setTargetSegment('Specific Users');
    setView('target-selection');
  };

  const handleSelectComplete = (users: RecipientUser[]) => {
    setSelectedUsers(users);
    if (users.length === 0) {
      setTargetSegment('All Users');
    }
    setView('compose');
  };

  const handleRemoveUser = (id: string) => {
    const updated = selectedUsers.filter(u => u.id !== id);
    setSelectedUsers(updated);
    if (updated.length === 0) {
      setTargetSegment('All Users');
    }
  };

  const handleSend = () => {
    // Reset state
    setTitle('');
    setBody('');
    setImageUrl('');
    setTargetSegment('All Users');
    setSelectedUsers([]);
    
    // Show Toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Push Notifications | Ride With Pals</title>
      </Helmet>

      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Sleek Minimal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view !== 'compose' && (
              <button 
                onClick={() => setView('compose')}
                className="flex items-center justify-center w-10 h-10 border border-border bg-surface rounded-xl text-text-muted hover:text-[#EB712B] transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h1 className="font-poppins font-extrabold text-2xl sm:text-[28px] text-text-main tracking-tight leading-none">
                Push Notifications
              </h1>
              <p className="font-roboto text-xs text-text-muted mt-1.5">
                Broadcast notification messages and alerts directly to mobile app drivers
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle (Only in Compose/History mode) */}
        {view !== 'target-selection' && (
          <div className="flex bg-surface border border-border rounded-xl p-1 gap-1 w-full sm:w-64">
            <button 
              onClick={() => setView('compose')}
              className={`flex-1 font-poppins font-semibold text-[11px] uppercase tracking-wider py-2.5 rounded-lg transition-colors ${view === 'compose' ? 'bg-[#EB712B] text-white' : 'text-text-muted hover:text-text-main'}`}
            >
              Compose
            </button>
            <button 
              onClick={() => setView('history')}
              className={`flex-1 font-poppins font-semibold text-[11px] uppercase tracking-wider py-2.5 rounded-lg transition-colors ${view === 'history' ? 'bg-[#EB712B] text-white' : 'text-text-muted hover:text-text-main'}`}
            >
              History Log
            </button>
          </div>
        )}

        {/* Primary Unified Dashboard Pane Card */}
        <div className="w-full max-w-5xl bg-surface border border-border rounded-3xl p-5 sm:p-10 shadow-sm relative overflow-hidden">
          <div ref={containerRef} className="w-full">
            {view === 'compose' && (
              <CompositionPanel 
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                targetSegment={targetSegment}
                setTargetSegment={setTargetSegment}
                selectedUsers={selectedUsers}
                onRemoveUser={handleRemoveUser}
                onOpenSelector={handleOpenSelector}
                onSend={handleSend}
              />
            )}

            {view === 'history' && (
              <PreviousNotifications />
            )}

            {view === 'target-selection' && (
              <RecipientSelector 
                initialSelectedIds={selectedUsers.map(u => u.id)}
                onSelectComplete={handleSelectComplete}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modern Sleek Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-4 sm:right-10 bg-surface border border-border shadow-2xl rounded-2xl p-5 flex items-start gap-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 w-[calc(100%-2rem)] sm:w-[360px]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 flex-shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-text-main text-[14px] uppercase tracking-wider">Notification Dispatched</h4>
            <p className="font-roboto text-text-muted text-[12px] mt-1 leading-relaxed">
              Your push alert has been successfully broadcast to the targeting drivers queue.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
