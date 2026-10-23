/* @layer tests @kind test */
import { colorDistance, extractPalette, mapToPalette } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { makeImage } from './make-image';
import { makeNoiseImage } from './make-noise-image';

const palette = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffffff'];

describe('mapToPalette', () => {
  it('emits only allowed indices', () => {
    const noise = makeNoiseImage(40, 21);
    const opaque = mapToPalette(noise, { palette, transparent: false });
    expect(opaque.pixels.every((slot) => slot < palette.length)).toBe(true);
    const keyed = mapToPalette(noise, { palette, transparent: true });
    expect(keyed.pixels.every((slot) => slot >= 1 && slot < palette.length)).toBe(true);
  });

  it('is deterministic', () => {
    const noise = makeNoiseImage(40, 21);
    const first = mapToPalette(noise, { palette, transparent: true });
    const second = mapToPalette(makeNoiseImage(40, 21), { palette, transparent: true });
    expect(second.pixels).toEqual(first.pixels);
  });

  it('maps exact colours to their own slot', () => {
    const image = makeImage(5, [
      [0, 0, 0, 255],
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
      [255, 255, 255, 255],
    ]);
    expect([...mapToPalette(image, { palette, transparent: false }).pixels]).toEqual([0, 1, 2, 3, 4]);
  });

  it('sends transparent pixels to index 0 and never picks the transparent slot as a colour', () => {
    const image = makeImage(3, [
      [0, 0, 0, 0],
      [10, 10, 10, 255],
      [255, 255, 255, 127],
    ]);
    const mapped = mapToPalette(image, { palette, transparent: true });
    expect([...mapped.pixels]).toEqual([0, 1, 0]);
  });

  it('sends transparent pixels to the background slot of an opaque palette', () => {
    const image = makeImage(2, [
      [200, 200, 200, 0],
      [200, 200, 200, 255],
    ]);
    expect([...mapToPalette(image, { palette, transparent: false }).pixels]).toEqual([0, 4]);
  });
});

describe('mapToPalette thresholds and edge cases', () => {
  it('applies the alpha threshold', () => {
    const image = makeImage(2, [
      [255, 0, 0, 127],
      [255, 0, 0, 128],
    ]);
    const options = { palette, transparent: true };
    expect([...mapToPalette(image, options).pixels]).toEqual([0, 1]);
    expect([...mapToPalette(image, { ...options, alphaThreshold: 100 }).pixels]).toEqual([1, 1]);
    expect([...mapToPalette(image, { ...options, alphaThreshold: 200 }).pixels]).toEqual([0, 0]);
  });

  it('breaks distance ties with the lowest index', () => {
    const image = makeImage(1, [[10, 20, 30, 255]]);
    const tied = ['#000000', '#102030', '#102030'];
    expect(mapToPalette(image, { palette: tied, transparent: false }).pixels[0]).toBe(1);
  });

  it('rejects an invalid colour but ignores the transparent slot text', () => {
    const image = makeImage(1, [[1, 2, 3, 255]]);
    expect(() => mapToPalette(image, { palette: ['#000000', 'red'], transparent: false })).toThrow();
    expect(mapToPalette(image, { palette: ['none', '#010203'], transparent: true }).pixels[0]).toBe(1);
  });

  it('maps an extracted palette back without leaving it', () => {
    const noise = makeNoiseImage(32, 9);
    const extracted = extractPalette(noise, { maxColors: 15 });
    const mapped = mapToPalette(noise, { palette: ['#000000', ...extracted], transparent: true });
    expect(mapped.pixels.every((slot) => slot >= 1 && slot <= extracted.length)).toBe(true);
  });

  it('measures zero distance only for equal colours', () => {
    expect(colorDistance(0x123456, 0x123456)).toBe(0);
    expect(colorDistance(0x123456, 0x123457)).toBeGreaterThan(0);
    expect(colorDistance(0x000000, 0xffffff)).toBe(colorDistance(0xffffff, 0x000000));
  });
});
