/**
 * @fileoverview Document Parser for CMS import modes.
 *
 * Converts raw text (extracted from .txt/.md/.docx or pasted) into
 * CMSBlock[] by detecting headings, bullet lists, and paragraphs.
 *
 * Detection heuristics (in priority order):
 *  1. Markdown heading: starts with `#` / `##` / `###`
 *  2. ALL_CAPS short line (<=80 chars, letters present, no trailing period/comma) → heading
 *  3. Short line ending with `:` (<=60 chars, <= 6 words) → heading
 *  4. Bullet markers: -, *, •, ›, –, —, numbered `1.` / `1)`, alphabetical `a.` / `a)`,
 *     including indented (sub-list) variants → all flattened into the current list group
 *  5. Remaining non-empty chunks → paragraph
 *
 * The old Title-Case heuristic has been intentionally removed — it caused too many
 * false positives for typical legal/policy documents where proper nouns and sentence
 * starts naturally produce capitalised words.
 */
import { nanoid } from 'nanoid';
import type { CMSBlock } from '@/features/cms/types';

// ── Regex constants ────────────────────────────────────────────────────────────

const MARKDOWN_HEADING_RE = /^#{1,3}\s+(.+)$/;

/**
 * Bullet patterns (applied to the TRIMMED line):
 *  - Standard markers:  -  *  •  ›  –  —  followed by space
 *  - Numbered:          1.  1)  followed by space
 *  - Alphabetical:      a.  a)  A.  A)  followed by space (sub-list letters)
 *  - Unicode bullets:   ▪  ▸  ○  ●  followed by space
 */
const BULLET_RE =
  /^[-*•›–—▪▸○●]\s+(.+)$|^\d{1,3}[.)]\s+(.+)$|^[a-zA-Z][.)]\s+(.+)$/;

// ── Heading heuristics ────────────────────────────────────────────────────────

function isMarkdownHeading(line: string): string | null {
  const m = line.match(MARKDOWN_HEADING_RE);
  return m ? m[1].trim() : null;
}

/**
 * Returns true if the line looks like an ALL_CAPS heading.
 * e.g. "PRIVACY POLICY", "1. INTRODUCTION", "DATA COLLECTION"
 */
function isAllCapsHeading(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.length > 80) return false;
  // Must contain at least one alpha character
  if (!/[A-Z]/.test(trimmed)) return false;
  // Must not end with a sentence-ending period or comma
  if (trimmed.endsWith('.') || trimmed.endsWith(',')) return false;
  // All alpha characters must be uppercase
  return trimmed === trimmed.toUpperCase();
}

/**
 * Returns true if this short line ending with `:` looks like a section label heading.
 * e.g. "Note:", "Important:", "Your Rights:", "How We Use Your Data:"
 * Requires <= 60 chars and <= 7 words to avoid classifying long sentences.
 */
function isColonHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.endsWith(':')) return false;
  if (trimmed.length > 60) return false;
  const words = trimmed.split(/\s+/);
  return words.length <= 7;
}

// ── Bullet extraction ─────────────────────────────────────────────────────────

/**
 * If the (trimmed) line is a bullet point, returns the text content.
 * Returns null if not a bullet.
 *
 * NOTE: indented sub-list items are already handled because we trim the raw line
 * before matching, so "  - sub item" → "- sub item" → matches correctly.
 * All sub-list items are intentionally flattened into the same list block.
 */
function extractBulletText(line: string): string | null {
  const m = line.match(BULLET_RE);
  if (!m) return null;
  // Capture group 1 (symbol bullet), 2 (numeric), or 3 (alpha)
  return (m[1] ?? m[2] ?? m[3] ?? '').trim();
}

// ── Core parser ────────────────────────────────────────────────────────────────

/**
 * Parse a raw text string into CMSBlock[].
 *
 * Key behaviours:
 * - Consecutive bullet lines (regardless of indent level) are grouped into one list block.
 * - A blank line flushes the current paragraph and/or list accumulator.
 * - Non-blank lines that are not headings or bullets are accumulated as a single paragraph
 *   (joined with a space), so soft-wrapped text becomes one paragraph block.
 */
export function parseTextToBlocks(raw: string): CMSBlock[] {
  if (!raw || !raw.trim()) return [];

  const lines = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n');

  const blocks: CMSBlock[] = [];
  let pendingBullets: string[] = [];
  let paragraphLines: string[] = [];

  const flushBullets = () => {
    if (pendingBullets.length > 0) {
      blocks.push({ id: nanoid(), type: 'list', content: [...pendingBullets] });
      pendingBullets = [];
    }
  };

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    const text = paragraphLines.join(' ').trim();
    if (text) blocks.push({ id: nanoid(), type: 'paragraph', content: text });
    paragraphLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Empty line → flush accumulators
    if (line === '') {
      flushParagraph();
      flushBullets();
      continue;
    }

    // ── 1. Markdown heading ──────────────────────────────────────────────────
    const mdHeading = isMarkdownHeading(line);
    if (mdHeading) {
      flushParagraph();
      flushBullets();
      blocks.push({ id: nanoid(), type: 'heading', content: mdHeading });
      continue;
    }

    // ── 2. Bullet item (including sub-list / indented bullets) ───────────────
    const bulletText = extractBulletText(line);
    if (bulletText !== null) {
      // Flush any open paragraph but NOT bullets — keep building the list
      flushParagraph();
      pendingBullets.push(bulletText);
      continue;
    }

    // ── 3. ALL_CAPS heading ──────────────────────────────────────────────────
    if (isAllCapsHeading(line)) {
      flushParagraph();
      flushBullets();
      blocks.push({ id: nanoid(), type: 'heading', content: line });
      continue;
    }

    // ── 4. Colon-terminated label heading ────────────────────────────────────
    if (isColonHeading(line)) {
      flushParagraph();
      flushBullets();
      // Strip trailing colon from the block content so it reads cleanly
      blocks.push({ id: nanoid(), type: 'heading', content: line.slice(0, -1) });
      continue;
    }

    // ── 5. Regular paragraph text ────────────────────────────────────────────
    // If we were building a bullet list and now hit paragraph text,
    // flush the list first — this starts a new context.
    flushBullets();
    paragraphLines.push(line);
  }

  // Flush any remaining accumulators at EOF
  flushParagraph();
  flushBullets();

  return blocks;
}

// ── File readers ───────────────────────────────────────────────────────────────

/** Parse a plain .txt or .md file via FileReader → CMSBlock[] */
export async function parsePlainTextFile(file: File): Promise<CMSBlock[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(parseTextToBlocks(text));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'utf-8');
  });
}

/**
 * Parse a .docx file using mammoth (lazy-loaded / code-split).
 * Extracts raw text with basic structure, then routes through parseTextToBlocks.
 */
export async function parseDocxFile(file: File): Promise<CMSBlock[]> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return parseTextToBlocks(result.value);
}

/** Dispatch to the correct parser based on file extension */
export async function parseFile(file: File): Promise<CMSBlock[]> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'docx') return parseDocxFile(file);
  return parsePlainTextFile(file);
}

/** File input accept attribute value */
export const ACCEPTED_FILE_TYPES = '.txt,.md,.markdown,.docx';

/** Human-readable label for supported formats */
export const ACCEPTED_FILE_LABEL = 'TXT, Markdown, or Word (.docx)';
