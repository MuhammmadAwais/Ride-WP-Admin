/**
 * @fileoverview Dual-Language Legal CMS Engine.
 * Features Block Editor with drag & drop, Smart Paste, File Upload,
 * real-time bilingual switching (English / Spanish), and XSS-safe serialization.
 */
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  Pencil,
  CheckCircle2,
  Eye,
  Heading,
  AlignLeft,
  List,
  GripVertical,
  Loader2,
  CloudUpload,
  ClipboardPaste,
  Layers,
  Globe,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';
import { type CMSBlock, type CMSBlockType } from '../types';
import { serializeCMSBlocks } from '../utils/contentAdapter';
import CMSBlockItem from './CMSBlockItem';
import CMSUploadMode from './CMSUploadMode';
import CMSPasteMode from './CMSPasteMode';

type InputMode = 'editor' | 'upload' | 'paste';
type CMSLanguage = 'en' | 'es';

const MODE_TABS: { id: InputMode; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'editor',
    label: 'Block Editor',
    icon: <Layers size={14} />,
    desc: 'Drag-and-drop structured block editor',
  },
  {
    id: 'upload',
    label: 'Upload',
    icon: <CloudUpload size={14} />,
    desc: 'Import a .txt, .md or .docx file',
  },
  {
    id: 'paste',
    label: 'Smart Paste',
    icon: <ClipboardPaste size={14} />,
    desc: 'Paste raw legal text with auto-detection',
  },
];

interface CMSContentEngineProps {
  pageTitle: string;
  pageSubtitle: string;
  initialBlocks: CMSBlock[];
  initialBlocksEs?: CMSBlock[];
  onSave: (
    blocksEn: CMSBlock[],
    blocksEs?: CMSBlock[],
    activeLanguage?: CMSLanguage
  ) => Promise<void> | void;
  isLoading?: boolean;
  isSaving?: boolean;
}

export default function CMSContentEngine({
  pageTitle,
  pageSubtitle,
  initialBlocks,
  initialBlocksEs = [],
  onSave,
  isLoading,
  isSaving,
}: CMSContentEngineProps) {
  const [activeLanguage, setActiveLanguage] = useState<CMSLanguage>('en');
  const [blocksEn, setBlocksEn] = useState<CMSBlock[]>(initialBlocks);
  const [blocksEs, setBlocksEs] = useState<CMSBlock[]>(initialBlocksEs);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('editor');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial blocks on prop updates
  useEffect(() => {
    setBlocksEn(initialBlocks);
  }, [initialBlocks]);

  useEffect(() => {
    setBlocksEs(initialBlocksEs);
  }, [initialBlocksEs]);

  // Current active blocks by language
  const blocks = activeLanguage === 'en' ? blocksEn : blocksEs;
  const setBlocks = useCallback(
    (action: React.SetStateAction<CMSBlock[]>) => {
      if (activeLanguage === 'en') {
        setBlocksEn(action);
      } else {
        setBlocksEs(action);
      }
    },
    [activeLanguage]
  );

  const charCount = useMemo(() => {
    return serializeCMSBlocks(blocks).length;
  }, [blocks]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // GSAP transition when toggling edit/preview or language
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [isEditing, activeLanguage]);

  const handleImportBlocks = useCallback(
    (imported: CMSBlock[]) => {
      setBlocks(imported);
      setInputMode('editor');
      setIsEditing(true);
    },
    [setBlocks]
  );

  const handleUpdateBlock = useCallback(
    (id: string, newContent: string | string[]) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, content: newContent } : b))
      );
    },
    [setBlocks]
  );

  const handleDeleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    },
    [setBlocks]
  );

  const handleAddBlock = (type: CMSBlockType) => {
    const newBlock: CMSBlock = {
      id: `new-block-${Date.now()}`,
      type,
      content:
        type === 'list'
          ? activeLanguage === 'es'
            ? ['Nuevo elemento de lista']
            : ['New bullet item']
          : activeLanguage === 'es'
          ? 'Nuevo elemento de texto...'
          : 'New text element...',
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  // ── HTML5 Drag & Drop ────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditing) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
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

  const handleSave = async () => {
    try {
      await onSave(blocksEn, blocksEs, activeLanguage);
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string; data?: { message?: string } };
      const errorMessage =
        errorObj?.data?.message ||
        errorObj?.message ||
        'Failed to save content changes to server.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ── Page Header & Language Switcher ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl sm:text-[28px] text-text-main tracking-tight leading-none">
            {pageTitle}
          </h1>
          <p className="font-roboto text-xs text-text-muted mt-1.5">{pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Dual Language Switcher */}
          <div className="inline-flex items-center p-1 bg-surface border border-border rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActiveLanguage('en')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeLanguage === 'en'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Globe size={13} />
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLanguage('es')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeLanguage === 'es'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Globe size={13} />
              <span>Español</span>
            </button>
          </div>

          {/* Edit/Preview toggle — only in editor mode */}
          {inputMode === 'editor' && (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center justify-center w-10 h-10 border border-border bg-surface rounded-xl transition-colors cursor-pointer select-none shrink-0 ${
                isEditing ? 'text-accent border-accent/40 bg-accent/5' : 'text-text-muted hover:text-accent'
              }`}
              title={isEditing ? 'Switch to Preview' : 'Edit Blocks'}
            >
              {isEditing ? <Eye size={18} /> : <Pencil size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Input Mode Tab Bar ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center p-1 bg-surface border border-border rounded-2xl gap-1 self-start">
          {MODE_TABS.map((tab) => {
            const isActive = inputMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setInputMode(tab.id);
                  if (tab.id !== 'editor') setIsEditing(false);
                }}
                title={tab.desc}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-poppins font-bold text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-muted hover:text-text-main hover:bg-hover'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <p className="font-roboto text-[11px] text-text-muted ml-1">
          {MODE_TABS.find((t) => t.id === inputMode)?.desc} • Active: <strong className="text-accent uppercase">{activeLanguage}</strong>
        </p>
      </div>

      {/* ── Main Content Card ────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl bg-surface border border-border rounded-3xl p-5 sm:p-10 shadow-sm relative overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-accent mb-3" />
            <p className="text-text-muted text-sm font-roboto">Loading CMS document from server...</p>
          </div>
        ) : inputMode === 'upload' ? (
          /* ── Upload Mode ────────────────────────────────────────────────── */
          <CMSUploadMode onImport={handleImportBlocks} />
        ) : inputMode === 'paste' ? (
          /* ── Smart Paste Mode ───────────────────────────────────────────── */
          <CMSPasteMode onImport={handleImportBlocks} />
        ) : (
          /* ── Block Editor Mode ──────────────────────────────────────────── */
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
                } ${draggedIndex === index ? 'opacity-30 scale-[0.98]' : ''} ${
                  dragOverIndex === index && draggedIndex !== index
                    ? 'border-2 border-dashed border-accent/40 bg-accent/5'
                    : ''
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

            {/* Empty state — show shortcuts */}
            {blocks.length === 0 && (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="font-poppins font-medium text-text-muted text-sm mb-4">
                  No {activeLanguage === 'es' ? 'Spanish' : 'English'} content blocks yet
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleAddBlock('paragraph')}
                      className="bg-accent/10 hover:bg-accent/20 text-accent font-poppins font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-colors cursor-pointer select-none"
                    >
                      Add First Block ({activeLanguage.toUpperCase()})
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setInputMode('upload')}
                        className="flex items-center gap-1.5 border border-border text-text-muted hover:text-accent hover:border-accent/40 font-poppins font-bold text-[10px] uppercase tracking-wider py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
                      >
                        <CloudUpload size={13} /> Upload Document
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode('paste')}
                        className="flex items-center gap-1.5 border border-border text-text-muted hover:text-accent hover:border-accent/40 font-poppins font-bold text-[10px] uppercase tracking-wider py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
                      >
                        <ClipboardPaste size={13} /> Smart Paste
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Add-block toolbar */}
            {isEditing && (
              <div className="pt-8 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-poppins font-bold text-text-muted text-[11px] uppercase tracking-wider mr-2">
                    Add Element ({activeLanguage.toUpperCase()}):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('heading')}
                    className="bg-main-bg hover:bg-hover border border-border text-text-main font-poppins font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                  >
                    <Heading size={13} className="text-accent" /> Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('paragraph')}
                    className="bg-main-bg hover:bg-hover border border-border text-text-main font-poppins font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                  >
                    <AlignLeft size={13} className="text-accent" /> Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('list')}
                    className="bg-main-bg hover:bg-hover border border-border text-text-main font-poppins font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                  >
                    <List size={13} className="text-accent" /> Bullet List
                  </button>
                </div>
              </div>
            )}

            {/* Save footer */}
            {isEditing && (
              <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-3xl">
                <div className="flex items-center gap-2 text-xs text-text-muted font-roboto">
                  <span className="font-medium text-text-main">
                    {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
                  </span>
                  <span>•</span>
                  <span>{charCount.toLocaleString()} chars</span>
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-mono text-[10px] font-bold uppercase">
                    {activeLanguage}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-poppins font-bold text-[11px] sm:text-[12px] uppercase tracking-widest py-3.5 px-10 rounded-xl transition-all shadow-sm cursor-pointer select-none flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  Save All Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Success Toast ────────────────────────────────────────────────────── */}
      {showToast && (
        <div className="fixed bottom-10 right-4 sm:right-10 bg-surface border border-border shadow-2xl rounded-2xl p-5 flex items-start gap-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 w-[calc(100%-2rem)] sm:w-[360px]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-text-main text-[14px] uppercase tracking-wider">
              CMS Changes Committed
            </h4>
            <p className="font-roboto text-text-muted text-[12px] mt-1 leading-relaxed">
              Your legal content blocks have been synchronized with the API successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
