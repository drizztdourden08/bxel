/* @layer tests @kind test */
import { ditherToPalette, mapToPalette } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { makeImage } from './make-image';
import { makeNoiseImage } from './make-noise-image';

const palette = ['#000000', '#ffffff'];

const flatGrey = (width: number, height: number) =>
  makeImage(
    width,
    Array.from({ length: width * height }, () => [128, 128, 128, 255] as const),
  );

const whites = (pixels: Uint8Array): number => pixels.filter((slot) => slot === 1).length;

describe('ditherToPalette', () => {
  it('emits only allowed indices for every matrix size', () => {
    const noise = makeNoiseImage(37, 4);
    for (const size of [2, 4, 8] as const) {
      const out = ditherToPalette(noise, { palette: ['#000000', '#808080', '#ffffff'], transparent: false, size });
      expect(out.pixels.every((slot) => slot < 3)).toBe(true);
      const keyed = ditherToPalette(noise, { palette: ['#000000', '#808080', '#ffffff'], transparent: true, size });
      expect(keyed.pixels.every((slot) => slot >= 1 && slot < 3)).toBe(true);
    }
  });

  it('is deterministic', () => {
    const noise = makeNoiseImage(33, 8);
    const options = { palette, transparent: false, size: 8 } as const;
    expect(ditherToPalette(noise, options).pixels).toEqual(ditherToPalette(makeNoiseImage(33, 8), options).pixels);
  });

  it('splits flat mid grey evenly in each matrix tile', () => {
    for (const size of [2, 4, 8] as const) {
      const out = ditherToPalette(flatGrey(size, size), { palette, transparent: false, size });
      expect(whites(out.pixels)).toBe((size * size) / 2);
    }
  });

  it('shifts the pattern with the origin', () => {
    const image = flatGrey(16, 4);
    const base = ditherToPalette(image, { palette, transparent: false, size: 4 });
    const shifted = ditherToPalette(image, { palette, transparent: false, size: 4, originX: 1 });
    expect(shifted.pixels).not.toEqual(base.pixels);
    for (let y = 0; y < 4; y += 1) {
      for (let x = 0; x < 15; x += 1) {
        expect(shifted.pixels[y * 16 + x]).toBe(base.pixels[y * 16 + x + 1]);
      }
    }
  });

  it('repeats with the matrix period and handles negative origins', () => {
    const image = flatGrey(8, 8);
    const base = ditherToPalette(image, { palette, transparent: false, size: 4 });
    const period = ditherToPalette(image, { palette, transparent: false, size: 4, originX: 4, originY: 8 });
    const negative = ditherToPalette(image, { palette, transparent: false, size: 4, originX: -4, originY: -4 });
    expect(period.pixels).toEqual(base.pixels);
    expect(negative.pixels).toEqual(base.pixels);
  });

  it('collapses to plain mapping with no spread', () => {
    const noise = makeNoiseImage(20, 2);
    const plain = mapToPalette(noise, { palette, transparent: false });
    const flat = ditherToPalette(noise, { palette, transparent: false, size: 4, spread: 0 });
    expect(flat.pixels).toEqual(plain.pixels);
  });

  it('keeps transparent pixels at index 0', () => {
    const image = makeImage(2, [
      [128, 128, 128, 0],
      [128, 128, 128, 255],
    ]);
    const out = ditherToPalette(image, { palette: ['#000000', '#000000', '#ffffff'], transparent: true, size: 2 });
    expect(out.pixels[0]).toBe(0);
    expect(out.pixels[1]).toBeGreaterThan(0);
  });
});
