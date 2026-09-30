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
  // ── EDIT MODE ─────────────────────────────────────────────────────────────
  if (isEditing) {
    if (block.type === 'heading') {
      return (
        <div className="w-full flex gap-3 items-center py-1">
          <span className="px-2 py-1 bg-accent/15 text-accent border border-accent/30 rounded-lg font-poppins font-bold text-[10px] uppercase tracking-wider shrink-0 select-none">
            H1
          </span>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={block.content as string}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              placeholder="Main Section Heading..."
              className="w-full h-11 font-poppins font-bold text-text-main text-base sm:text-lg bg-main-bg border border-border rounded-xl px-4 py-2 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            className="text-text-muted hover:text-error p-2.5 bg-main-bg border border-border rounded-xl transition-colors cursor-pointer shrink-0"
            title="Delete Heading"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    }

    if (block.type === 'subheading') {
      return (
        <div className="w-full flex gap-3 items-center py-1">
          <span className="px-2 py-1 bg-surface border border-border text-text-muted rounded-lg font-poppins font-bold text-[10px] uppercase tracking-wider shrink-0 select-none">
            H2
          </span>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={block.content as string}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              placeholder="Subsection Heading..."
              className="w-full h-10 font-poppins font-semibold text-text-main text-sm sm:text-base bg-main-bg border border-border rounded-xl px-3.5 py-1.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            className="text-text-muted hover:text-error p-2.5 bg-main-bg border border-border rounded-xl transition-colors cursor-pointer shrink-0"
            title="Delete Subheading"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    }

    if (block.type === 'paragraph') {
      return (
        <div className="w-full flex gap-3 items-start py-1">
          <div className="flex-1 min-w-0">
            <textarea
              value={block.content as string}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              rows={4}
              placeholder="Paragraph text..."
              className="w-full bg-main-bg border border-border rounded-xl px-4 py-3 text-text-main font-roboto text-[14.5px] leading-relaxed focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            className="text-text-muted hover:text-error p-2.5 bg-main-bg border border-border rounded-xl transition-colors cursor-pointer shrink-0 mt-0.5"
            title="Delete Paragraph"
          >
            <Trash2 size={16} />
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
        <div className="w-full flex gap-3 items-start border border-dashed border-border/80 rounded-2xl p-4 bg-main-bg/30">
          <div className="flex-1 space-y-2 py-1">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 ml-1" />
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(idx, e.target.value)}
                  placeholder={`List item ${idx + 1}`}
                  className="flex-1 h-9 bg-main-bg border border-border rounded-xl px-3 py-1 text-text-main font-roboto text-[14px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-text-muted hover:text-error p-1.5 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="text-accent hover:text-accent/80 text-[11px] font-poppins font-bold uppercase tracking-wider flex items-center gap-1.5 mt-2 transition-colors cursor-pointer select-none"
            >
              <Plus size={14} /> Add Bullet Item
            </button>
          </div>
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            className="text-text-muted hover:text-error p-2.5 bg-main-bg border border-border rounded-xl transition-colors cursor-pointer shrink-0 mt-1"
            title="Delete List Block"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    }
  }

  // ── READ MODE ──────────────────────────────────────────────────────────────
  if (block.type === 'heading') {
    return (
      <div className="w-full pt-8 pb-3 first:pt-0">
        <h2 className="font-poppins font-bold text-text-main text-xl sm:text-[22px] tracking-tight leading-snug pb-2.5 border-b border-border/80">
          {block.content}
        </h2>
      </div>
    );
  }

  if (block.type === 'subheading') {
    return (
      <div className="w-full pt-6 pb-2 first:pt-0">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-4.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
          <h3 className="font-poppins font-semibold text-text-main text-[16px] sm:text-[17px] tracking-tight leading-tight">
            {block.content}
          </h3>
        </div>
      </div>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <div className="w-full py-1">
        <p className="font-roboto text-text-muted text-[14.5px] sm:text-[15px] leading-[1.8] whitespace-pre-wrap">
          {block.content}
        </p>
      </div>
    );
  }

  if (block.type === 'list') {
    const items = Array.isArray(block.content) ? block.content : [block.content];
    return (
      <div className="w-full py-1 pl-1">
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 font-roboto text-[14.5px] sm:text-[15px]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0 opacity-90" aria-hidden="true" />
              <span className="text-text-muted leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export default React.memo(CMSBlockItem);
