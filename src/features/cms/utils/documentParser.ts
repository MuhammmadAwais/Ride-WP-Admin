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

function parseMarkdownHeading(line: string): { type: 'heading' | 'subheading'; content: string } | null {
  const m = line.match(/^(#{1,6})\s+(.+)$/);
  if (!m) return null;
  const hashes = m[1].length;
  const content = m[2].trim();
  return {
    type: hashes === 1 ? 'heading' : 'subheading',
    content,
  };
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
 * - Markdown `#` parsed as 'heading', `##` / `###` parsed as 'subheading'.
 * - ALL CAPS lines parsed as 'heading'.
 * - Colon-ended short lines parsed as 'subheading'.
 * - Isolated bullet lines (e.g. "• Acceptance" or "• Controller" with no adjacent bullets)
 *   that act as section titles are converted to 'subheading' rather than single-item lists.
 * - Multi-item consecutive bullets are grouped into 'list'.
 * - Non-blank text accumulated as 'paragraph'.
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
    let text = paragraphLines.join('\n').trim();
    if (text) {
      // Intelligently split contact / legal attribution lines onto their own line
      // e.g., "Spain. Privacy and rights email: admin@ridewithpals.com. Website: www.ridewithpals.com."
      text = text.replace(
        /\.\s+(Privacy and rights email:|Email:|Website:|Contact:)/gi,
        '.\n$1'
      );
      blocks.push({ id: nanoid(), type: 'paragraph', content: text });
    }
    paragraphLines = [];
  };

  // Helper to find the next non-empty line
  const getNextNonEmptyLine = (startIndex: number): string | null => {
    for (let j = startIndex + 1; j < lines.length; j++) {
      const l = lines[j].trim();
      if (l !== '') return l;
    }
    return null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Empty line → flush accumulators
    if (line === '') {
      flushParagraph();
      flushBullets();
      continue;
    }

    // ── 1. Markdown heading (# H1, ##/### H2/H3) ───────────────────────────
    const mdHeading = parseMarkdownHeading(line);
    if (mdHeading) {
      flushParagraph();
      flushBullets();
      blocks.push({ id: nanoid(), type: mdHeading.type, content: mdHeading.content });
      continue;
    }

    // ── 2. ALL_CAPS heading (e.g. PRIVACY POLICY) ──────────────────────────
    if (isAllCapsHeading(line)) {
      flushParagraph();
      flushBullets();
      blocks.push({ id: nanoid(), type: 'heading', content: line });
      continue;
    }

    // ── 3. Colon-terminated label heading (e.g. "Data Processed:") ─────────
    if (isColonHeading(line)) {
      flushParagraph();
      flushBullets();
      blocks.push({ id: nanoid(), type: 'subheading', content: line.slice(0, -1) });
      continue;
    }

    // ── 4. Bullet item handling with isolated-title detection ──────────────
    const bulletText = extractBulletText(line);
    if (bulletText !== null) {
      // Check if this is an isolated bullet acting as a section title
      // (e.g., "• Acceptance" or "• Controller" with no other bullet lines next to it)
      const isAlreadyInList = pendingBullets.length > 0;
      const nextLine = getNextNonEmptyLine(i);
      const isNextLineBullet = nextLine !== null && extractBulletText(nextLine) !== null;

      // An isolated bullet title has:
      // 1. Not preceded by another bullet in this group
      // 2. Not followed by another bullet
      // 3. Short title-like text (<= 75 chars)
      // 4. Does not end with sentence punctuation (., ;, ,)
      const isIsolatedBulletTitle =
        !isAlreadyInList &&
        !isNextLineBullet &&
        bulletText.length <= 75 &&
        !bulletText.endsWith('.') &&
        !bulletText.endsWith(';') &&
        !bulletText.endsWith(',');

      if (isIsolatedBulletTitle) {
        flushParagraph();
        flushBullets();
        blocks.push({ id: nanoid(), type: 'subheading', content: bulletText });
        continue;
      }

      // Normal bullet list item: accumulate into list
      flushParagraph();
      pendingBullets.push(bulletText);
      continue;
    }

    // ── 5. Regular paragraph text ──────────────────────────────────────────
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
