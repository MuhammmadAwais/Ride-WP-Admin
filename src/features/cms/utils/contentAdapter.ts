/**
 * @fileoverview Content Adapter for CMS domain.
 * Serializes and deserializes between backend content strings and UI CMSBlock[] structures.
 * 
 * Supports:
 * - Clean Markdown/Text format: human-readable, mobile-app compatible, and 70% smaller.
 * - Legacy JSON format: backward-compatible parsing for existing entries in the database.
 */
import { type CMSBlock } from '@/features/cms/types';
import { parseTextToBlocks } from './documentParser';

/**
 * Deserializes backend content string to CMSBlock array.
 * 1. Checks for legacy JSON-stringified CMSBlock[] array (backward compatibility).
 * 2. Parses clean formatted text / markdown into structured CMSBlock[] via documentParser.
 * 3. Falls back to fallbackBlocks if empty or unparseable.
 */
export function deserializeCMSBlocks(
  contentString: string | undefined,
  fallbackBlocks: CMSBlock[]
): CMSBlock[] {
  if (!contentString || !contentString.trim()) {
    return fallbackBlocks;
  }

  const trimmed = contentString.trim();

  // 1. Backward compatibility: handle previously saved raw JSON CMSBlock[] arrays
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        typeof parsed[0] === 'object' &&
        'type' in parsed[0]
      ) {
        return parsed as CMSBlock[];
      }
    } catch {
      // Not valid JSON, continue to text parser
    }
  }

  // 2. Parse clean formatted markdown/text into structured blocks
  try {
    const parsedBlocks = parseTextToBlocks(contentString);
    if (parsedBlocks.length > 0) {
      return parsedBlocks;
    }
  } catch {
    // If text parsing encountered an issue, use fallback below
  }

  return fallbackBlocks;
}

/**
 * Serializes CMSBlock[] into clean, human-readable formatted Markdown/Text.
 * 
 * Benefits over raw JSON:
 * - Mobile app displays clean formatted text immediately without raw JSON brackets/keys.
 * - Drastically reduces byte size by ~70%, preventing MySQL "Data too long for column 'content'" errors.
 * - Web app (whitespace-pre-wrap) and mobile text views render beautifully.
 */
export function serializeCMSBlocks(blocks: CMSBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === 'heading') {
        const headingText = (typeof block.content === 'string' ? block.content : '').trim();
        if (!headingText) return '';
        return headingText.startsWith('#') ? headingText : `# ${headingText}`;
      }

      if (block.type === 'list') {
        const items = Array.isArray(block.content) ? block.content : [block.content];
        return items
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter(Boolean)
          .map((item) =>
            item.startsWith('•') || item.startsWith('-') || item.startsWith('*')
              ? item
              : `• ${item}`
          )
          .join('\n');
      }

      // Paragraph block
      const paragraphText = typeof block.content === 'string' ? block.content.trim() : '';
      return paragraphText;
    })
    .filter(Boolean)
    .join('\n\n');
}

