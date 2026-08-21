/**
 * @fileoverview CMSPasteMode — Smart paste input mode for the CMS editor.
 * A large textarea that parses pasted or typed content in real-time into
 * CMSBlock[]. Shows a live block-type breakdown and scrollable preview panel.
 */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  ClipboardPaste, Loader2, Eraser, Heading,
  AlignLeft, List, Sparkles,
} from 'lucide-react';
import { parseTextToBlocks } from '../utils/documentParser';
import type { CMSBlock } from '../types';

interface CMSPasteModeProps {
  onImport: (blocks: CMSBlock[]) => void;
}

const PLACEHOLDER = `Paste or type your content here…

PRIVACY POLICY

Introduction:
This document explains how we collect and use your data.

Data Collection:
We collect the following information from you:
- Your name and email address
- Usage data and preferences
- Device and browser information

a. Additional information you voluntarily provide
b. Communication and support records

Your Rights:
You have the right to request deletion of your personal data at any time.
Contact us at privacy@example.com to submit a request.`;

const BLOCK_META = {
  heading:   { label: 'H', cls: 'bg-[#EB712B]/12 text-[#EB712B]',  icon: <Heading   size={10} /> },
  paragraph: { label: 'P', cls: 'bg-border/60 text-text-muted',    icon: <AlignLeft size={10} /> },
  list:      { label: 'L', cls: 'bg-blue-500/10 text-blue-400',    icon: <List      size={10} /> },
};

const CMSPasteMode: React.FC<CMSPasteModeProps> = ({ onImport }) => {
  const [rawText,     setRawText]     = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Live parse — memoised so we don't re-parse on unrelated renders
  const parsedBlocks = useMemo<CMSBlock[]>(
    () => (rawText.trim() ? parseTextToBlocks(rawText) : []),
    [rawText],
  );

  const headingsCount   = parsedBlocks.filter(b => b.type === 'heading').length;
  const paragraphsCount = parsedBlocks.filter(b => b.type === 'paragraph').length;
  const listsCount      = parsedBlocks.filter(b => b.type === 'list').length;

  const handleImport = useCallback(() => {
    if (parsedBlocks.length === 0) return;
    setIsImporting(true);
    setTimeout(() => {
      onImport(parsedBlocks);
      setIsImporting(false);
    }, 120);
  }, [parsedBlocks, onImport]);

  const handleClear = () => {
    setRawText('');
    textareaRef.current?.focus();
  };

  const hasContent = rawText.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">

      {/* ── Textarea ──────────────────────────────────────────────────────────── */}
      <div className={`relative rounded-[24px] transition-all duration-400 ${
        hasContent
          ? 'ring-2 ring-[#EB712B]/30 shadow-[0_0_40px_rgba(235,113,43,0.08)] bg-surface'
          : 'ring-1 ring-border/60 hover:ring-border hover:shadow-[0_0_30px_rgba(235,113,43,0.03)] bg-surface'
      }`}>
        <textarea
          ref={textareaRef}
          id="cms-paste-textarea"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={16}
          spellCheck={false}
          className="w-full bg-transparent border-none rounded-[24px] px-6 py-5 pb-14 text-text-main font-roboto text-[14px] leading-[1.8] focus:outline-none focus:ring-1 focus:ring-[#EB712B]/50 resize-none transition-all custom-scrollbar placeholder:text-text-muted/50"
          aria-label="Paste or type content to import"
        />

        {/* Bottom toolbar inside textarea */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3.5 rounded-b-[24px] border-t border-border/40 bg-surface/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            {hasContent && (
              <>
                <span className="font-roboto text-[11px] text-text-muted opacity-60 select-none font-medium">
                  {rawText.length.toLocaleString()} chars
                </span>
                <span className="w-px h-3 bg-border" />
                <span className="font-roboto text-[11px] text-text-muted opacity-60 select-none font-medium">
                  {rawText.split('\n').length} lines
                </span>
              </>
            )}
          </div>
          {hasContent && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear all content"
              className="flex items-center gap-1.5 text-text-muted hover:text-red-400 font-poppins font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
            >
              <Eraser size={12} strokeWidth={2.5} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Live status / empty hint ─────────────────────────────────────────── */}
      {hasContent ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface flex-wrap">
          {/* Pulse indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-poppins font-bold text-[10px] uppercase tracking-wider text-emerald-500">
              {parsedBlocks.length} Block{parsedBlocks.length !== 1 ? 's' : ''} Detected
            </span>
          </div>

          <div className="w-px h-4 bg-border shrink-0" />

          {/* Type chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {headingsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EB712B]/10 font-poppins font-bold text-[9px] uppercase tracking-wider text-[#EB712B]">
                <Heading size={9} /> {headingsCount} Heading{headingsCount > 1 ? 's' : ''}
              </span>
            )}
            {paragraphsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-border/60 font-poppins font-bold text-[9px] uppercase tracking-wider text-text-muted">
                <AlignLeft size={9} /> {paragraphsCount} Para{paragraphsCount > 1 ? 's' : ''}
              </span>
            )}
            {listsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 font-poppins font-bold text-[9px] uppercase tracking-wider text-blue-400">
                <List size={9} /> {listsCount} List{listsCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border">
          <ClipboardPaste size={15} className="text-text-muted shrink-0 opacity-40" />
          <p className="font-roboto text-text-muted text-xs opacity-50">
            Paste anything — plain text, legal docs, markdown, web content — blocks appear instantly.
          </p>
        </div>
      )}

      {/* ── Block preview panel ──────────────────────────────────────────────── */}
      {parsedBlocks.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-[#EB712B]" />
              <span className="font-poppins font-bold text-[10px] uppercase tracking-wider text-text-muted">
                Detected Blocks
              </span>
            </div>
            <span className="font-roboto text-[11px] text-text-muted opacity-50">
              {Math.min(parsedBlocks.length, 6)} of {parsedBlocks.length} shown
            </span>
          </div>

          <div className="p-3 space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
            {parsedBlocks.slice(0, 6).map((block) => {
              const meta = BLOCK_META[block.type];
              const preview = Array.isArray(block.content)
                ? (block.content as string[]).slice(0, 2).map(s => `• ${s}`).join('  ') +
                  (block.content.length > 2 ? '  …' : '')
                : String(block.content).slice(0, 110) + (String(block.content).length > 110 ? '…' : '');

              return (
                <div
                  key={block.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-main-bg border border-border/40"
                >
                  <span className={`shrink-0 inline-flex items-center gap-1 w-7 h-5 justify-center rounded font-poppins font-extrabold text-[8px] uppercase tracking-wider ${meta.cls}`}>
                    {meta.icon}
                  </span>
                  <p className="font-roboto text-text-muted text-[11.5px] leading-snug flex-1 min-w-0 truncate">
                    {preview}
                  </p>
                </div>
              );
            })}
            {parsedBlocks.length > 6 && (
              <p className="font-poppins font-bold text-[10px] uppercase tracking-wider text-text-muted/40 text-center py-1">
                + {parsedBlocks.length - 6} more block{parsedBlocks.length - 6 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Import button ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleImport}
          disabled={parsedBlocks.length === 0 || isImporting}
          className="flex-1 sm:flex-none bg-[#EB712B] hover:bg-[#d66524] disabled:opacity-35 text-white font-poppins font-bold text-[11px] uppercase tracking-widest py-3.5 px-10 rounded-xl transition-all shadow-sm shadow-[#EB712B]/20 cursor-pointer select-none flex items-center justify-center gap-2"
        >
          {isImporting
            ? <><Loader2 size={14} className="animate-spin" /> Importing…</>
            : parsedBlocks.length > 0
              ? `Import ${parsedBlocks.length} Block${parsedBlocks.length !== 1 ? 's' : ''} into Editor`
              : 'Paste content above to continue'}
        </button>
      </div>

      {/* ── Syntax guide ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 px-1 pt-1">
        {[
          ['# Heading text',     '→ Heading block'],
          ['ALL CAPS LINE',      '→ Heading block'],
          ['"Section Name:"',   '→ Heading block (colon label)'],
          ['- or • item',        '→ Bullet list item'],
          ['1. 2. 3.',           '→ Numbered list'],
          ['a. b. c.',           '→ Alphabetical sub-list'],
        ].map(([syntax, result]) => (
          <div key={syntax} className="flex items-center gap-2">
            <code className="font-roboto text-[10px] text-[#EB712B] bg-[#EB712B]/8 px-1.5 py-0.5 rounded">
              {syntax}
            </code>
            <span className="font-roboto text-text-muted text-[10px] opacity-60">{result}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CMSPasteMode;
