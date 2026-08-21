/**
 * @fileoverview CMSUploadMode — Document upload input mode for the CMS editor.
 * Accepts .txt, .md, and .docx files via drag-and-drop or file browser.
 * Parses the uploaded file into CMSBlock[] and shows a structured preview
 * before the user confirms importing into the editor.
 */
import React, { useCallback, useRef, useState } from 'react';
import {
  CloudUpload, FileText, CheckCircle2, AlertCircle,
  Loader2, X, FolderOpen, Heading, AlignLeft, List,
} from 'lucide-react';
import { parseFile, ACCEPTED_FILE_TYPES, ACCEPTED_FILE_LABEL } from '../utils/documentParser';
import type { CMSBlock } from '../types';

interface CMSUploadModeProps {
  onImport: (blocks: CMSBlock[]) => void;
}

type UploadState = 'idle' | 'parsing' | 'done' | 'error';

const BLOCK_ICON = {
  heading:   <Heading   size={11} className="text-[#EB712B]" />,
  paragraph: <AlignLeft size={11} className="text-text-muted" />,
  list:      <List      size={11} className="text-blue-400" />,
};

const BLOCK_LABEL_CLS = {
  heading:   'bg-[#EB712B]/12 text-[#EB712B] border-[#EB712B]/20',
  paragraph: 'bg-border/50 text-text-muted border-border',
  list:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const CMSUploadMode: React.FC<CMSUploadModeProps> = ({ onImport }) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [isDragOver, setIsDragOver]   = useState(false);
  const [fileName, setFileName]       = useState('');
  const [fileSize, setFileSize]       = useState('');
  const [parsedBlocks, setParsedBlocks] = useState<CMSBlock[]>([]);
  const [errorMsg, setErrorMsg]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setFileSize(formatSize(file.size));
    setUploadState('parsing');
    setErrorMsg('');
    try {
      const blocks = await parseFile(file);
      if (blocks.length === 0) {
        setErrorMsg('No structured content was found in this file. Try a plain-text or Markdown document.');
        setUploadState('error');
        return;
      }
      setParsedBlocks(blocks);
      setUploadState('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to parse file.');
      setUploadState('error');
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleReset = () => {
    setUploadState('idle');
    setFileName('');
    setFileSize('');
    setParsedBlocks([]);
    setErrorMsg('');
  };

  const headingsCount   = parsedBlocks.filter(b => b.type === 'heading').length;
  const paragraphsCount = parsedBlocks.filter(b => b.type === 'paragraph').length;
  const listsCount      = parsedBlocks.filter(b => b.type === 'list').length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">

      {/* ══ IDLE: Drop Zone ═══════════════════════════════════════════════════ */}
      {uploadState === 'idle' && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-5 rounded-[24px] border-2 border-dashed py-16 px-8 cursor-pointer select-none transition-all duration-400 group ${
              isDragOver
                ? 'border-[#EB712B] bg-[#EB712B]/5 scale-[1.01] shadow-[0_0_40px_rgba(235,113,43,0.1)]'
                : 'border-border/60 hover:border-[#EB712B]/50 hover:bg-[#EB712B]/[0.02] hover:shadow-[0_0_30px_rgba(235,113,43,0.06)]'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Upload document file"
            />

            {/* Icon */}
            <div className={`w-[72px] h-[72px] rounded-[20px] flex items-center justify-center transition-all duration-400 ${
              isDragOver
                ? 'bg-[#EB712B] text-white shadow-lg shadow-[#EB712B]/30 scale-110'
                : 'bg-main-bg border border-border/80 text-text-muted group-hover:bg-[#EB712B]/10 group-hover:text-[#EB712B] group-hover:border-[#EB712B]/30'
            }`}>
              <CloudUpload size={30} strokeWidth={1.5} />
            </div>

            {/* Text */}
            <div className="text-center space-y-1.5">
              <p className={`font-poppins font-bold text-[16px] transition-colors duration-300 ${
                isDragOver ? 'text-[#EB712B]' : 'text-text-main group-hover:text-[#EB712B]'
              }`}>
                {isDragOver ? 'Release to upload' : 'Drop your document here'}
              </p>
              <p className="font-roboto text-text-muted text-sm transition-colors duration-300 group-hover:text-text-main/80">
                or{' '}
                <span className={`font-semibold transition-colors duration-300 ${
                  isDragOver ? 'text-[#EB712B]' : 'text-text-main group-hover:text-[#EB712B]'
                }`}>
                  click to browse
                </span>
              </p>
              <p className="font-roboto text-text-muted text-[11px] opacity-60 pt-2 tracking-wide">
                Accepts <span className="text-[#EB712B] font-medium opacity-100">{ACCEPTED_FILE_LABEL}</span>
              </p>
            </div>

            {/* Browse pill button */}
            <button
              type="button"
              tabIndex={-1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-poppins font-bold text-[10px] uppercase tracking-widest transition-all duration-300 border shadow-sm ${
                isDragOver
                  ? 'bg-[#EB712B] border-[#EB712B] text-white shadow-[#EB712B]/20'
                  : 'bg-surface border-border text-text-muted group-hover:border-[#EB712B]/40 group-hover:text-[#EB712B] group-hover:bg-[#EB712B]/5'
              }`}
            >
              <FolderOpen size={13} /> Browse Files
            </button>
          </div>

          {/* Tips strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
            {[
              '# Heading or ALL CAPS line → Heading block',
              '- or • line → Bullet list',
              'a. b. c. → also detected as list',
              '"Note:" or "Label:" → Heading block',
            ].map((tip) => (
              <span key={tip} className="flex items-center gap-1.5 font-roboto text-text-muted text-[11px]">
                <span className="w-1 h-1 rounded-full bg-[#EB712B]/50 shrink-0" />
                {tip}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ══ PARSING ═══════════════════════════════════════════════════════════ */}
      {uploadState === 'parsing' && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface py-16 px-8">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-[#EB712B]/10 flex items-center justify-center">
              <Loader2 size={26} className="animate-spin text-[#EB712B]" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-poppins font-bold text-text-main text-sm">Analysing document…</p>
            <p className="font-roboto text-text-muted text-xs mt-1 opacity-70">{fileName}</p>
          </div>
        </div>
      )}

      {/* ══ ERROR ════════════════════════════════════════════════════════════ */}
      {uploadState === 'error' && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
            <AlertCircle size={18} />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="font-poppins font-bold text-text-main text-sm">Could not parse document</p>
            <p className="font-roboto text-text-muted text-xs leading-relaxed">{errorMsg}</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 font-poppins font-bold text-[10px] uppercase tracking-wider text-[#EB712B] hover:underline cursor-pointer"
            >
              Try a different file →
            </button>
          </div>
        </div>
      )}

      {/* ══ DONE: Preview & Confirm ═══════════════════════════════════════════ */}
      {uploadState === 'done' && (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">

          {/* File header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-bold text-text-main text-sm truncate">{fileName}</p>
              <p className="font-roboto text-text-muted text-xs mt-0.5">{fileSize} · Parsed successfully</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              title="Remove and start over"
              className="text-text-muted hover:text-red-400 p-2 rounded-xl hover:bg-hover transition-colors cursor-pointer shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-stretch divide-x divide-border border-b border-border">
            {[
              { count: parsedBlocks.length, label: 'Total Blocks', color: 'text-text-main' },
              { count: headingsCount,       label: 'Headings',     color: 'text-[#EB712B]' },
              { count: paragraphsCount,     label: 'Paragraphs',   color: 'text-text-muted' },
              { count: listsCount,          label: 'Lists',        color: 'text-blue-400' },
            ].map(({ count, label, color }) => (
              <div key={label} className="flex-1 flex flex-col items-center justify-center py-4 gap-0.5">
                <span className={`font-poppins font-extrabold text-xl ${color}`}>{count}</span>
                <span className="font-roboto text-text-muted text-[10px] uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>

          {/* Block preview list */}
          <div className="p-4 space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
            <p className="font-poppins font-bold text-text-muted text-[10px] uppercase tracking-wider px-1 mb-2">
              Preview — first {Math.min(parsedBlocks.length, 8)} blocks
            </p>
            {parsedBlocks.slice(0, 8).map((block) => {
              const content = Array.isArray(block.content)
                ? (block.content as string[]).slice(0, 2).map(s => `• ${s}`).join('  ') +
                  (block.content.length > 2 ? '  …' : '')
                : String(block.content).slice(0, 100) + (String(block.content).length > 100 ? '…' : '');

              return (
                <div
                  key={block.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-main-bg border border-border/40 hover:border-border transition-colors"
                >
                  <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-poppins font-bold text-[9px] uppercase tracking-wider whitespace-nowrap ${BLOCK_LABEL_CLS[block.type]}`}>
                    {BLOCK_ICON[block.type]}
                    {block.type}
                  </span>
                  <p className="font-roboto text-text-muted text-[12px] truncate flex-1 min-w-0 leading-snug">
                    {content}
                  </p>
                </div>
              );
            })}
            {parsedBlocks.length > 8 && (
              <p className="font-poppins font-bold text-text-muted text-[10px] uppercase tracking-wider text-center pt-1 opacity-50">
                + {parsedBlocks.length - 8} more block{parsedBlocks.length - 8 > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-3 px-4 pb-5 pt-2">
            <button
              type="button"
              onClick={() => onImport(parsedBlocks)}
              className="flex-1 sm:flex-none bg-[#EB712B] hover:bg-[#d66524] text-white font-poppins font-bold text-[11px] uppercase tracking-widest py-3 px-8 rounded-xl transition-all shadow-sm shadow-[#EB712B]/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText size={14} />
              Import {parsedBlocks.length} Blocks into Editor
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="border border-border text-text-muted hover:text-text-main font-poppins font-bold text-[10px] uppercase tracking-wider py-3 px-5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSUploadMode;
