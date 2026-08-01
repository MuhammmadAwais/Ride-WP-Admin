import { useState, useCallback, useRef } from 'react';
import { Pencil, CheckCircle2, Eye, Heading, AlignLeft, List, GripVertical, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { type CMSBlock, type CMSBlockType } from '../types';
import CMSBlockItem from './CMSBlockItem';

interface CMSContentEngineProps {
  pageTitle: string;
  pageSubtitle: string;
  initialBlocks: CMSBlock[];
  onSave: (blocks: CMSBlock[]) => void;
  isLoading?: boolean;
  isSaving?: boolean;
}

export default function CMSContentEngine({
  pageTitle,
  pageSubtitle,
  initialBlocks,
  onSave,
  isLoading,
  isSaving,
}: CMSContentEngineProps) {
  const [blocks, setBlocks] = useState<CMSBlock[]>(initialBlocks);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag and drop state indicators
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Linear GSAP page fades when toggling read/edit layouts (Anti-CLS, lag-free)
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

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const handleAddBlock = (type: CMSBlockType) => {
    const newId = `new-block-${Date.now()}`;
    const newBlock: CMSBlock = {
      id: newId,
      type,
      content: type === 'list' ? ['New bullet item'] : 'New text element...'
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  // --- HTML5 DRAG & DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditing) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Smooth custom drag preview visibility if needed, standard browser handles beautifully
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isEditing || draggedIndex === null) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (!isEditing || draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...blocks];
    const dragItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, dragItem);
    setBlocks(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#EB712B] mb-3" />
            <p className="text-text-muted text-sm font-roboto">Loading CMS content from server...</p>
          </div>
        ) : (
          <div ref={containerRef} className="w-full space-y-1">
            
            {blocks.map((block, index) => (
              <div 
                key={block.id}
                draggable={isEditing}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                className={`flex items-center gap-4 transition-all duration-200 rounded-2xl ${
                  isEditing ? 'hover:bg-hover/30 p-2.5 -mx-2.5 border border-transparent' : ''
                } ${
                  draggedIndex === index ? 'opacity-30 scale-[0.98]' : ''
                } ${
                  dragOverIndex === index && draggedIndex !== index ? 'border-2 border-dashed border-[#EB712B]/40 bg-[#EB712B]/5' : ''
                }`}
              >
                {isEditing && (
                  <div 
                    className="cursor-grab active:cursor-grabbing text-text-muted/40 hover:text-text-main transition-colors shrink-0 p-1 select-none"
                    title="Drag to reorder"
                  >
                    <GripVertical size={20} />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <CMSBlockItem 
                    block={block}
                    isEditing={isEditing}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                  />
                </div>
              </div>
            ))}

            {/* Empty block state CTA */}
            {blocks.length === 0 && (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="font-poppins font-medium text-text-muted text-sm mb-3">No content blocks exist on this page</p>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleAddBlock('paragraph')}
                    className="bg-[#EB712B]/10 hover:bg-[#EB712B]/20 text-[#EB712B] font-poppins font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-colors cursor-pointer select-none"
                  >
                    Add First Paragraph
                  </button>
                )}
              </div>
            )}

            {/* Dynamic Interactive Element Toolbar (Only active in dynamic block editor mode) */}
            {isEditing && (
              <div className="pt-8 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-poppins font-bold text-text-muted text-[11px] uppercase tracking-wider mr-2">
                    Add Element:
                  </span>
                  <button 
                    type="button" 
                    onClick={() => handleAddBlock('heading')}
                    className="bg-main-bg hover:bg-hover border border-border text-text-main font-poppins font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                  >
                    <Heading size={13} className="text-[#EB712B]" /> Heading
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleAddBlock('paragraph')}
                    className="bg-main-bg hover:bg-hover border border-border text-text-main font-poppins font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                  >
                    <AlignLeft size={13} className="text-[#EB712B]" /> Paragraph
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleAddBlock('list')}
                    className="bg-main-bg hover:bg-hover border border-border text-text-main font-poppins font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                  >
                    <List size={13} className="text-[#EB712B]" /> Bullet List
                  </button>
                </div>
              </div>
            )}

            {/* Action Footer (Only active in dynamic block editor mode) */}
            {isEditing && (
              <div className="pt-6 flex justify-end max-w-3xl">
                <button 
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-[#EB712B] hover:bg-[#d66524] text-white font-poppins font-bold text-[11px] sm:text-[12px] uppercase tracking-widest py-3.5 px-10 rounded-xl transition-all shadow-sm cursor-pointer select-none flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Flat Success Toast */}
      {showToast && (
        <div className="fixed bottom-10 right-4 sm:right-10 bg-surface border border-border shadow-2xl rounded-2xl p-5 flex items-start gap-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 w-[calc(100%-2rem)] sm:w-[360px]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
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
