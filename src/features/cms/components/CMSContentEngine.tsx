import { useState, useCallback, useRef } from 'react';
import { Pencil, CheckCircle2, Eye } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { type CMSBlock } from '../types';
import CMSBlockItem from './CMSBlockItem';

interface CMSContentEngineProps {
  pageTitle: string;
  pageSubtitle: string;
  initialBlocks: CMSBlock[];
  onSave: (blocks: CMSBlock[]) => void;
}

export default function CMSContentEngine({ pageTitle, pageSubtitle, initialBlocks, onSave }: CMSContentEngineProps) {
  const [blocks, setBlocks] = useState<CMSBlock[]>(initialBlocks);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Linear low-latency GSAP page fades when toggling read/edit layouts (Anti-CLS, lag-free)
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'none' }
      );
    }
  }, [isEditing]);

  const handleUpdateBlock = useCallback((id: string, newContent: string | string[]) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: newContent } : b));
  }, []);

  const handleSave = () => {
    onSave(blocks);
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Dynamic CMS Panel Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl sm:text-[28px] text-text-main tracking-tight leading-none">
            {pageTitle}
          </h1>
          <p className="font-roboto text-xs text-text-muted mt-1.5">
            {pageSubtitle}
          </p>
        </div>

        {/* Dynamic Inline Edit Toggle Controls */}
        <button 
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center justify-center w-10 h-10 border border-border bg-surface rounded-xl transition-colors cursor-pointer select-none ${isEditing ? 'text-[#EB712B]' : 'text-text-muted hover:text-[#EB712B]'}`}
          title={isEditing ? 'View Reader Mode' : 'Edit CMS Blocks'}
        >
          {isEditing ? <Eye size={18} /> : <Pencil size={18} />}
        </button>
      </div>

      {/* Main Professional Card Wrapper */}
      <div className="w-full max-w-5xl bg-surface border border-border rounded-3xl p-5 sm:p-10 shadow-sm relative overflow-hidden">
        <div ref={containerRef} className="w-full">
          {blocks.map(block => (
            <CMSBlockItem 
              key={block.id}
              block={block}
              isEditing={isEditing}
              onUpdate={handleUpdateBlock}
            />
          ))}

          {/* Action Footer (Only active in dynamic block editor mode) */}
          {isEditing && (
            <div className="pt-6 flex justify-end max-w-3xl">
              <button 
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto bg-[#EB712B] hover:bg-[#d66524] text-white font-poppins font-bold text-[11px] sm:text-[12px] uppercase tracking-widest py-3.5 px-10 rounded-xl transition-all shadow-sm cursor-pointer select-none"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Flat Success Toast */}
      {showToast && (
        <div className="fixed bottom-10 right-4 sm:right-10 bg-surface border border-border shadow-2xl rounded-2xl p-5 flex items-start gap-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 w-[calc(100%-2rem)] sm:w-[360px]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 flex-shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-text-main text-[14px] uppercase tracking-wider">CMS Changes Committed</h4>
            <p className="font-roboto text-text-muted text-[12px] mt-1 leading-relaxed">
              Your polymorphic block mutations have been updated successfully.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
