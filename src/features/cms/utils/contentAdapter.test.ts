import { describe, it, expect } from 'vitest';
import { serializeCMSBlocks, deserializeCMSBlocks } from './contentAdapter';
import type { CMSBlock } from '../types';

describe('contentAdapter', () => {
  const sampleBlocks: CMSBlock[] = [
    {
      id: 'h-1',
      type: 'heading',
      content: 'RIDE WITH PALS TERMS',
    },
    {
      id: 'p-1',
      type: 'paragraph',
      content: 'These are the official terms and conditions for all members.',
    },
    {
      id: 'l-1',
      type: 'list',
      content: [
        'Owner: Next Pals, S.L.',
        'CIF: B93792000',
        'Website: www.ridewithpals.com',
      ],
    },
  ];

  it('serializes CMSBlock[] into clean text/markdown without JSON overhead', () => {
    const serialized = serializeCMSBlocks(sampleBlocks);
    
    // Must NOT contain raw JSON syntax or nanoid IDs
    expect(serialized).not.toContain('"id":');
    expect(serialized).not.toContain('"type":');
    expect(serialized).not.toContain('{');
    expect(serialized).not.toContain('}');

    // Must contain clean heading, paragraph, and bullet items
    expect(serialized).toContain('# RIDE WITH PALS TERMS');
    expect(serialized).toContain('These are the official terms and conditions for all members.');
    expect(serialized).toContain('• Owner: Next Pals, S.L.');
    expect(serialized).toContain('• CIF: B93792000');
    expect(serialized).toContain('• Website: www.ridewithpals.com');

    // Verify size is significantly smaller than JSON.stringify(sampleBlocks, null, 2)
    const jsonSize = JSON.stringify(sampleBlocks, null, 2).length;
    expect(serialized.length).toBeLessThan(jsonSize * 0.6); // at least 40% reduction
  });

  it('deserializes clean text/markdown back into structured CMSBlock[]', () => {
    const serialized = serializeCMSBlocks(sampleBlocks);
    const restored = deserializeCMSBlocks(serialized, []);

    expect(restored.length).toBe(3);
    expect(restored[0].type).toBe('heading');
    expect(restored[0].content).toBe('RIDE WITH PALS TERMS');

    expect(restored[1].type).toBe('paragraph');
    expect(restored[1].content).toBe('These are the official terms and conditions for all members.');

    expect(restored[2].type).toBe('list');
    expect(restored[2].content).toEqual([
      'Owner: Next Pals, S.L.',
      'CIF: B93792000',
      'Website: www.ridewithpals.com',
    ]);
  });

  it('preserves backward compatibility with legacy JSON-serialized content', () => {
    const legacyJson = JSON.stringify(sampleBlocks, null, 2);
    const restored = deserializeCMSBlocks(legacyJson, []);

    expect(restored.length).toBe(3);
    expect(restored[0].content).toBe('RIDE WITH PALS TERMS');
    expect(restored[1].content).toBe('These are the official terms and conditions for all members.');
    expect(restored[2].type).toBe('list');
  });

  it('falls back to fallbackBlocks when content is empty', () => {
    const fallback: CMSBlock[] = [{ id: 'fb', type: 'paragraph', content: 'Fallback' }];
    expect(deserializeCMSBlocks('', fallback)).toEqual(fallback);
    expect(deserializeCMSBlocks('   ', fallback)).toEqual(fallback);
    expect(deserializeCMSBlocks(undefined, fallback)).toEqual(fallback);
  });
});
