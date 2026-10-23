/* @layer tests @kind test */
import { thumbnailFactor, thumbnailRgba, upscaleIndexed, upscaleRgba } from '@bxel/formats';
import { describe, expect, it } from 'vitest';

const image = {
  data: new Uint8ClampedArray([1, 1, 1, 255, 2, 2, 2, 255, 3, 3, 3, 255, 4, 4, 4, 255]),
  width: 2,
  height: 2,
};

const reds = (data: Uint8ClampedArray): number[] =>
  Array.from(data).filter((_, i) => i % 4 === 0);

describe('upscaleRgba', () => {
  it('repeats each pixel into a factor by factor block', () => {
    const scaled = upscaleRgba(image, 2);
    expect(scaled.width).toBe(4);
    expect(scaled.height).toBe(4);
    expect(reds(scaled.data)).toEqual([1, 1, 2, 2, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 4, 4]);
  });

  it('keeps the image at factor 1', () => {
    const scaled = upscaleRgba(image, 1);
    expect(Array.from(scaled.data)).toEqual(Array.from(image.data));
  });

  it('clamps the factor to 1 through 16', () => {
    expect(upscaleRgba(image, 0).width).toBe(2);
    expect(upscaleRgba(image, Number.NaN).width).toBe(2);
    expect(upscaleRgba(image, 99).width).toBe(32);
    expect(upscaleRgba(image, 3.9).width).toBe(6);
  });

  it('only creates colours that already exist', () => {
    const scaled = upscaleRgba(image, 5);
    expect(new Set(reds(scaled.data))).toEqual(new Set([1, 2, 3, 4]));
  });
});

describe('upscaleIndexed', () => {
  it('scales indices and keeps the palette', () => {
    const palette = new Uint8Array(8);
    const scaled = upscaleIndexed(
      { indices: new Uint8Array([0, 1, 1, 0]), palette, width: 2, height: 2 },
      3,
    );
    expect(scaled.width).toBe(6);
    expect(scaled.height).toBe(6);
    expect(scaled.palette).toBe(palette);
    expect(Array.from(scaled.indices.subarray(0, 6))).toEqual([0, 0, 0, 1, 1, 1]);
    expect(Array.from(scaled.indices.subarray(18, 24))).toEqual([1, 1, 1, 0, 0, 0]);
  });
});

describe('thumbnails', () => {
  it.each([
    [32, 32, 8],
    [16, 16, 16],
    [8, 8, 16],
    [100, 20, 2],
    [20, 100, 2],
    [128, 64, 2],
    [200, 200, 1],
    [256, 256, 1],
    [300, 100, 1],
    [4096, 4096, 1],
  ])('uses factor from %i by %i', (width, height, factor) => {
    expect(thumbnailFactor(width, height)).toBe(factor);
  });

  it('keeps the long side at or below 256 when the source fits', () => {
    const data = new Uint8ClampedArray(48 * 20 * 4);
    const thumb = thumbnailRgba({ data, width: 48, height: 20 });
    expect(thumb.width).toBe(240);
    expect(thumb.height).toBe(100);
  });

  it('accepts a smaller maximum side', () => {
    expect(thumbnailFactor(10, 10, 64)).toBe(6);
  });
});
