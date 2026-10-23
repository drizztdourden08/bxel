/* @layer tests @kind test */
import { ALPHA_THRESHOLD_DEFAULT, countColors } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { makeImage } from './make-image';
import { makeNoiseImage } from './make-noise-image';

const image = makeImage(3, [
  [255, 0, 0, 255],
  [0, 255, 0, 255],
  [255, 0, 0, 255],
  [0, 0, 255, 255],
  [0, 255, 0, 255],
  [255, 0, 0, 255],
]);

describe('countColors', () => {
  it('orders colours by frequency then value', () => {
    const { colors } = countColors(image);
    expect(colors).toEqual([
      { rgb: 0xff0000, count: 3 },
      { rgb: 0x00ff00, count: 2 },
      { rgb: 0x0000ff, count: 1 },
    ]);
  });

  it('breaks frequency ties by ascending value', () => {
    const { colors } = countColors(
      makeImage(2, [
        [9, 9, 9, 255],
        [1, 1, 1, 255],
      ]),
    );
    expect(colors.map((entry) => entry.rgb)).toEqual([0x010101, 0x090909]);
  });

  it('is deterministic', () => {
    const noise = makeNoiseImage(32, 7);
    expect(countColors(noise)).toEqual(countColors(noise));
  });

  it('treats alpha at or above the threshold as opaque', () => {
    expect(ALPHA_THRESHOLD_DEFAULT).toBe(128);
    const edge = makeImage(2, [
      [10, 10, 10, 127],
      [20, 20, 20, 128],
    ]);
    const census = countColors(edge);
    expect(census.colors).toEqual([{ rgb: 0x141414, count: 1 }]);
    expect(census.opaquePixels).toBe(1);
    expect(census.transparentPixels).toBe(1);
  });

  it('honours a custom threshold', () => {
    const edge = makeImage(2, [
      [10, 10, 10, 127],
      [20, 20, 20, 128],
    ]);
    expect(countColors(edge, { alphaThreshold: 1 }).colors).toHaveLength(2);
    expect(countColors(edge, { alphaThreshold: 129 }).colors).toHaveLength(0);
    expect(countColors(edge, { alphaThreshold: 0 }).transparentPixels).toBe(0);
  });

  it('ignores the colour of transparent pixels', () => {
    const census = countColors(
      makeImage(2, [
        [1, 2, 3, 0],
        [4, 5, 6, 0],
      ]),
    );
    expect(census.colors).toEqual([]);
    expect(census.transparentPixels).toBe(2);
  });
});
