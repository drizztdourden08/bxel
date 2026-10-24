/* @layer tests @kind test */
import { base64Length, decodeBase64, decodePixelBlock, encodeBase64, INDEXES_TEXT_MAX } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const nodeEncode = (bytes: Uint8Array): string => Buffer.from(bytes).toString('base64');

describe('base64 codecs', () => {
  it('matches the standard encoder for every length up to 40', () => {
    for (let length = 0; length <= 40; length += 1) {
      const bytes = Uint8Array.from({ length }, (_unused, index) => (index * 37 + 11) % 256);
      expect(encodeBase64(bytes)).toBe(nodeEncode(bytes));
    }
  });

  it('round trips a full read buffer', () => {
    const bytes = Uint8Array.from({ length: 65536 }, (_unused, index) => index % 256);
    const text = encodeBase64(bytes);
    expect(text.length).toBe(INDEXES_TEXT_MAX);
    expect(decodeBase64(text)).toEqual(bytes);
  });

  it('computes the encoded length', () => {
    expect(base64Length(65536)).toBe(87384);
    expect(base64Length(1)).toBe(4);
    expect(base64Length(3)).toBe(4);
    expect(base64Length(4)).toBe(8);
  });

  it('refuses text that is not canonical standard base64', () => {
    for (const text of ['AA', 'AA=', 'A===', 'AAB=', 'AB==', 'AA-_', 'AA==AA==', 'AA\n==', 'A A=']) {
      expect(decodeBase64(text)).toBeNull();
    }
  });

  it('decodes the empty string to no bytes', () => {
    expect(decodeBase64('')).toEqual(new Uint8Array(0));
  });

  it('checks the byte count of a pixel block against its rectangle', () => {
    const good = decodePixelBlock('AAECAw==', { width: 2, height: 2 }, 'steps.0.options.pixels');
    expect(good.ok && good.value).toEqual(Uint8Array.from([0, 1, 2, 3]));
    const short = decodePixelBlock('AAEC', { width: 2, height: 2 }, 'steps.0.options.pixels');
    expect(short.ok).toBe(false);
    expect(!short.ok && short.error.path).toBe('steps.0.options.pixels');
    expect(!short.ok && short.error.code).toBe('INVALID_OPTION');
    expect(decodePixelBlock('!!!!', { width: 1, height: 1 }, 'p').ok).toBe(false);
  });
});
