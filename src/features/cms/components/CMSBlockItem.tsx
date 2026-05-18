import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { type CMSBlock } from '../types';

interface CMSBlockItemProps {
  block: CMSBlock;
  isEditing: boolean;
  onUpdate: (id: string, newContent: string | string[]) => void;
  onDelete: (id: string) => void;
}

const CMSBlockItem: React.FC<CMSBlockItemProps> = ({ block, isEditing, onUpdate, onDelete }) => {
  
  if (isEditing) {
    if (block.type === 'heading') {
      return (
        <div className="my-4 max-w-3xl flex gap-3 items-center">
          <div className="flex-1">
            <input 
              type="text"
              value={block.content as string}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              className="w-full h-12 font-poppins font-semibold text-text-main text-lg bg-main-bg border border-border rounded-xl px-3 py-2 focus:outline-none focus:border-[#EB712B] transition-colors"
            />
          </div>
          <button 
            type="button"
            onClick={() => onDelete(block.id)}
            className="text-text-muted hover:text-red-400 p-3 bg-main-bg border border-border rounded-xl transition-colors cursor-pointer flex-shrink-0"
            title="Delete Block"
          >
            <Trash2 size={18} />
          </button>
        </div>
      );
    }

    if (block.type === 'paragraph') {
      return (
        <div className="my-4 max-w-3xl flex gap-3 items-start">
          <div className="flex-1">
            <textarea 
              value={block.content as string}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              rows={4}
              className="w-full bg-main-bg border border-border rounded-xl px-3 py-2 text-text-main font-roboto text-[15px] leading-relaxed focus:outline-none focus:border-[#EB712B] resize-none transition-colors"
            />
          </div>
          <button 
            type="button"
            onClick={() => onDelete(block.id)}
            className="text-text-muted hover:text-red-400 p-3 bg-main-bg border border-border rounded-xl transition-colors cursor-pointer flex-shrink-0 mt-0.5"
            title="Delete Block"
          >
            <Trash2 size={18} />
          </button>
        </div>
      );
    }

    if (block.type === 'list') {
      const items = Array.isArray(block.content) ? block.content : [block.content];
      
      const handleItemChange = (index: number, val: string) => {
        const updated = [...items];
        updated[index] = val;
        onUpdate(block.id, updated);
      };

      const handleAddItem = () => {
        onUpdate(block.id, [...items, '']);
      };

      const handleRemoveItem = (index: number) => {
        const updated = items.filter((_, i) => i !== index);
        onUpdate(block.id, updated);
      };

      return (
        <div className="my-4 max-w-3xl flex gap-3 items-start border border-dashed border-border/30 rounded-2xl p-4 bg-main-bg/10">
          <div className="flex-1 space-y-2 py-1 px-3 border border-transparent">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input 
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(idx, e.target.value)}
                  className="flex-1 h-10 bg-main-bg border border-border rounded-xl px-3 py-1 text-text-main font-roboto text-[14px] focus:outline-none focus:border-[#EB712B]"
                />
                <button 
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-text-muted hover:text-red-400 p-2 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={handleAddItem}
              className="text-[#EB712B] hover:text-[#d66524] text-[11px] font-poppins font-bold uppercase tracking-wider flex items-center gap-1.5 mt-2 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Bullet Item
            </button>
          </div>
          <button 
            type="button"
            onClick={() => onDelete(block.id)}
            className="text-text-muted hover:text-red-400 p-3 bg-main-bg border border-border rounded-xl transition-colors cursor-pointer flex-shrink-0 mt-1"
            title="Delete List Block"
          >
            <Trash2 size={18} />
          </button>
        </div>
      );
    }
  }

  // --- READ MODE ---
  if (block.type === 'heading') {
    return (
      <div className="my-4 max-w-3xl">
        <h2 className="h-12 flex items-center font-poppins font-semibold text-text-main text-lg py-2 px-3 border border-transparent">
          {block.content}
        </h2>
      </div>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <div className="my-4 max-w-3xl">
        <p className="font-roboto text-text-muted text-[15px] leading-relaxed py-2 px-3 border border-transparent whitespace-pre-wrap">
          {block.content}
        </p>
      </div>
    );
  }

  if (block.type === 'list') {
    const items = Array.isArray(block.content) ? block.content : [block.content];
    return (
      <div className="my-4 max-w-3xl space-y-2 py-1 px-3 border border-transparent">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 py-1 font-roboto text-[15px]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#EB712B] mt-2 flex-shrink-0" />
            <span className="text-text-muted leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default React.memo(CMSBlockItem);
