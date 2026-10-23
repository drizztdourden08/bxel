/* @layer tests @kind test */
import { countColors, extractPalette, isHexColor } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { makeImage } from './make-image';
import { makeNoiseImage } from './make-noise-image';

describe('extractPalette', () => {
  it('gives identical output for the same image and limit', () => {
    const noise = makeNoiseImage(48, 11);
    for (const maxColors of [1, 2, 7, 15, 16, 64, 255]) {
      const first = extractPalette(noise, { maxColors });
      const second = extractPalette(makeNoiseImage(48, 11), { maxColors });
      expect(second).toEqual(first);
    }
  });

  it('never exceeds the limit and only emits valid opaque colours', () => {
    const noise = makeNoiseImage(40, 3);
    for (const maxColors of [1, 2, 3, 15, 16, 31, 100, 256]) {
      const palette = extractPalette(noise, { maxColors });
      expect(palette.length).toBeLessThanOrEqual(maxColors);
      expect(palette.length).toBeGreaterThan(0);
      expect(palette.every(isHexColor)).toBe(true);
      expect(new Set(palette).size).toBe(palette.length);
    }
  });

  it('keeps exact colours when the image fits the limit', () => {
    const image = makeImage(2, [
      [255, 0, 0, 255],
      [255, 0, 0, 255],
      [0, 0, 255, 255],
      [0, 255, 0, 255],
    ]);
    expect(extractPalette(image, { maxColors: 8 })).toEqual(['#ff0000', '#0000ff', '#00ff00']);
  });

  it('ignores transparent pixels and returns nothing for an empty request', () => {
    const image = makeImage(2, [
      [255, 0, 0, 0],
      [0, 0, 255, 255],
    ]);
    expect(extractPalette(image, { maxColors: 4 })).toEqual(['#0000ff']);
    expect(extractPalette(image, { maxColors: 0 })).toEqual([]);
    expect(extractPalette(makeImage(1, [[1, 2, 3, 0]]), { maxColors: 4 })).toEqual([]);
  });

  it('respects the alpha threshold', () => {
    const image = makeImage(2, [
      [255, 0, 0, 100],
      [0, 0, 255, 255],
    ]);
    expect(extractPalette(image, { maxColors: 4 })).toEqual(['#0000ff']);
    expect(extractPalette(image, { maxColors: 4, alphaThreshold: 50 })).toHaveLength(2);
  });

  it('reduces many colours to a smaller palette', () => {
    const noise = makeNoiseImage(64, 5);
    expect(countColors(noise).colors.length).toBeGreaterThan(1000);
    expect(extractPalette(noise, { maxColors: 16 }).length).toBeLessThanOrEqual(16);
  });
});
