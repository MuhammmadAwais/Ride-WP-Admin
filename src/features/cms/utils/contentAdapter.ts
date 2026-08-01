/**
 * @fileoverview Content Adapter for CMS domain.
 * Serializes and deserializes between backend content strings and UI CMSBlock[] structures.
 */
import { type CMSBlock } from '@/features/cms/types';

/**
 * Deserializes backend content string to CMSBlock array.
 * Supports JSON stringified blocks or falls back to creating a single paragraph block
 * or using default fallback blocks.
 */
export function deserializeCMSBlocks(contentString: string | undefined, fallbackBlocks: CMSBlock[]): CMSBlock[] {
  if (!contentString || !contentString.trim()) {
    return fallbackBlocks;
  }

  try {
    const parsed = JSON.parse(contentString);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && 'type' in parsed[0]) {
      return parsed as CMSBlock[];
    }
  } catch {
    // If not valid JSON, treat as raw text or markdown and wrap in a paragraph/heading block
  }

  // Fallback: convert raw string into paragraphs by double newlines
  const paragraphs = contentString
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return fallbackBlocks;
  }

  return paragraphs.map((p, idx) => ({
    id: `block-${idx + 1}-${Date.now()}`,
    type: idx === 0 && p.length < 60 ? 'heading' : 'paragraph',
    content: p,
  }));
}

/**
 * Serializes CMSBlock[] into a JSON string for storing in backend `content` column.
 */
export function serializeCMSBlocks(blocks: CMSBlock[]): string {
  return JSON.stringify(blocks, null, 2);
}
