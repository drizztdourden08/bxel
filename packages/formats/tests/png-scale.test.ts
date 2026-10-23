/* @layer tests @kind test */
import {
  downscaleRgba,
  thumbnailFactor,
  thumbnailRgba,
  thumbnailStep,
  upscaleIndexed,
  upscaleRgba,
} from '@bxel/formats';
import type { RgbaImage } from '@bxel/formats';
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

describe('downscaleRgba', () => {
  const grid = (width: number, height: number): RgbaImage => {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i += 1) data.set([i % 251, 7, 9, 255], i * 4);
    return { data, width, height };
  };

  it('takes every step-th pixel, starting at the top left', () => {
    const scaled = downscaleRgba(grid(5, 3), 2);
    expect(scaled.width).toBe(3);
    expect(scaled.height).toBe(2);
    expect(reds(scaled.data)).toEqual([0, 2, 4, 10, 12, 14]);
  });

  it('keeps the image at step 1 and clamps a bad step to 1', () => {
    expect(Array.from(downscaleRgba(image, 1).data)).toEqual(Array.from(image.data));
    expect(downscaleRgba(image, 0).width).toBe(2);
    expect(downscaleRgba(image, Number.NaN).width).toBe(2);
  });

  it('never invents a colour', () => {
    const source = grid(64, 64);
    const kept = new Set(reds(source.data));
    expect(reds(downscaleRgba(source, 3).data).every((value) => kept.has(value))).toBe(true);
  });
});

describe('thumbnail downscaling', () => {
  it.each([
    [256, 256, 1],
    [257, 10, 2],
    [300, 100, 2],
    [512, 512, 2],
    [513, 20, 3],
    [4096, 4096, 16],
    [100, 700, 3],
  ])('uses step from %i by %i', (width, height, step) => {
    expect(thumbnailStep(width, height)).toBe(step);
  });

  it('fits a wide sprite to at most 256 pixels on the long side', () => {
    const thumb = thumbnailRgba({ data: new Uint8ClampedArray(300 * 100 * 4), width: 300, height: 100 });
    expect([thumb.width, thumb.height]).toEqual([150, 50]);
    expect(thumb.data).toHaveLength(150 * 50 * 4);
  });

  it('fits the largest allowed source and a tall one', () => {
    const big = thumbnailRgba({ data: new Uint8ClampedArray(4096 * 4096 * 4), width: 4096, height: 4096 });
    expect([big.width, big.height]).toEqual([256, 256]);
    const tall = thumbnailRgba({ data: new Uint8ClampedArray(3 * 1000 * 4), width: 3, height: 1000 });
    expect([tall.width, tall.height]).toEqual([1, 250]);
  });

  it('samples source pixels without blurring', () => {
    const width = 600;
    const data = new Uint8ClampedArray(width * 2 * 4);
    for (let i = 0; i < width * 2; i += 1) data.set([i % 2 === 0 ? 200 : 10, 0, 0, 255], i * 4);
    const thumb = thumbnailRgba({ data, width, height: 2 });
    expect([thumb.width, thumb.height]).toEqual([200, 1]);
    expect(new Set(reds(thumb.data))).toEqual(new Set([200, 10]));
  });

  it('keeps upscaling small sources with whole-number factors', () => {
    const thumb = thumbnailRgba({ data: new Uint8ClampedArray(100 * 20 * 4), width: 100, height: 20 });
    expect([thumb.width, thumb.height]).toEqual([200, 40]);
  });

  it('honours a smaller maximum side when downscaling', () => {
    const thumb = thumbnailRgba({ data: new Uint8ClampedArray(100 * 40 * 4), width: 100, height: 40 }, 32);
    expect([thumb.width, thumb.height]).toEqual([25, 10]);
  });
});
