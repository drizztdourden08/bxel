/* @layer tests @kind test */
import { formatHex, isHexColor, parseHex } from '@bxel/palette';
import { describe, expect, it } from 'vitest';

describe('hex helpers', () => {
  it('parses lowercase and uppercase #rrggbb', () => {
    expect(parseHex('#ff8000')).toBe(0xff8000);
    expect(parseHex('#FF8000')).toBe(0xff8000);
    expect(parseHex('#000000')).toBe(0);
  });

  it('rejects anything else', () => {
    for (const text of ['ff8000', '#fff', '#ff80000', '#gg0000', '', '# ff8000', '#ff8000 ']) {
      expect(parseHex(text)).toBeNull();
      expect(isHexColor(text)).toBe(false);
    }
    expect(isHexColor(0xff8000)).toBe(false);
    expect(isHexColor('#ff8000')).toBe(true);
  });

  it('formats lowercase with padding', () => {
    expect(formatHex(0)).toBe('#000000');
    expect(formatHex(0x0000ff)).toBe('#0000ff');
    expect(formatHex(0xabcdef)).toBe('#abcdef');
  });

  it('round trips every parsed value', () => {
    for (const rgb of [0, 1, 255, 0x123456, 0xffffff]) {
      expect(parseHex(formatHex(rgb))).toBe(rgb);
    }
  });
});
