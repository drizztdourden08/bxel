/* @layer tests @kind test */
import { makeSampler, mmpx, scale2x, scale3x } from '@bxel/raster';
import type { IndexImage, ResampleAlgorithm, StepConfig } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { luma, referenceMmpx } from './mmpx-reference';

const PALETTE_SIZE = 6;
const lumaTable = (index: number): number => luma(packed(index));
const packed = (index: number): number => (index === 0 ? 0 : (0xff000000 | (((index * 53) & 255) << 16) | (((index * 97) & 255) << 8) | ((index * 29) & 255)) >>> 0);
const CONFIG: StepConfig = { border: 'transparent', same: (a, b) => a === b, luma: lumaTable };

const random = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const randomImage = (seed: number, width: number, height: number, colours: number): IndexImage => {
  const next = random(seed);
  const pixels = new Uint8Array(width * height);
  for (let at = 0; at < pixels.length; at++) pixels[at] = Math.floor(next() * colours);
  return { width, height, pixels };
};

const blobImage = (seed: number): IndexImage => {
  const next = random(seed);
  const size = 12;
  const pixels = new Uint8Array(size * size);
  for (let blob = 0; blob < 4; blob++) {
    const cx = next() * size;
    const cy = next() * size;
    const radius = 1.5 + next() * 3;
    const colour = 1 + Math.floor(next() * (PALETTE_SIZE - 1));
    for (let at = 0; at < pixels.length; at++) {
      if (Math.hypot((at % size) - cx, Math.floor(at / size) - cy) < radius) pixels[at] = colour;
    }
  }
  return { width: size, height: size, pixels };
};

const rowsOf = (image: IndexImage): string[] =>
  Array.from({ length: image.height }, (_, y) => Array.from(image.pixels.subarray(y * image.width, (y + 1) * image.width), (value) => (value === 0 ? '.' : String(value))).join(''));

const imageOf = (rows: readonly string[]): IndexImage => ({
  width: rows[0]?.length ?? 0,
  height: rows.length,
  pixels: Uint8Array.from(rows.join(''), (char) => (char === '.' ? 0 : Number(char))),
});

const values = (pixels: Uint8Array): Set<number> => new Set(pixels);

describe('MMPX against the published reference code', () => {
  test.each(Array.from({ length: 40 }, (_, seed) => seed))('random sprite %i matches pixel for pixel', (seed) => {
    const image = seed % 2 === 0 ? randomImage(seed + 1, 9 + (seed % 5), 8 + (seed % 7), 2 + (seed % 4)) : blobImage(seed);
    const expected = referenceMmpx(Uint32Array.from(image.pixels, packed), image.width, image.height);
    const actual = mmpx(image, CONFIG);
    const lookup = new Map(Array.from({ length: 256 }, (_, index) => [packed(index), index] as const));
    expect(Array.from(expected, (colour) => lookup.get(colour))).toEqual(Array.from(actual.pixels));
  });

  test('a diagonal line and an L shape keep their shape (golden)', () => {
    const image = imageOf(['1.......', '.1......', '..1.....', '...1....', '......22', '......2.', '......2.', '........']);
    expect(rowsOf(mmpx(image, CONFIG))).toEqual([
      '11..............',
      '111.............',
      '.111............',
      '..111...........',
      '...111..........',
      '....111.........',
      '.....111........',
      '......11........',
      '............2222',
      '............2222',
      '............22..',
      '............22..',
      '............22..',
      '............22..',
      '................',
      '................',
    ]);
  });
});

describe('Scale2x and Scale3x', () => {
  test('a lone diagonal corner is rounded the way the reference EPX rules say (golden)', () => {
    const image = imageOf(['.1.', '11.', '...']);
    expect(rowsOf(scale2x(image, CONFIG))).toEqual(['..11..', '.111..', '1111..', '111...', '......', '......']);
  });

  test('Scale3x of a flat image is the flat image', () => {
    const image = imageOf(['11', '11']);
    expect(rowsOf(scale3x(image, { ...CONFIG, border: 'clamp' }))).toEqual(['111111', '111111', '111111', '111111', '111111', '111111']);
  });
});

const ALGORITHMS: readonly ResampleAlgorithm[] = ['nearest', 'rotsprite', 'cleanedge', 'scale2x', 'scale3x', 'mmpx'];

describe('palette closure', () => {
  test.each(ALGORITHMS)('%s only returns indexes found in its input', (algorithm) => {
    for (let seed = 1; seed <= 25; seed++) {
      const image = seed % 2 === 0 ? randomImage(seed, 10, 10, 5) : blobImage(seed);
      const sampler = makeSampler({ image, algorithm, scale: 4, options: {} });
      const known = values(image.pixels);
      for (let v = 0; v < image.height; v += 0.21) {
        for (let u = 0; u < image.width; u += 0.19) {
          const value = sampler(u, v);
          expect(value === -1 || known.has(value)).toBe(true);
        }
      }
    }
  });

  test.each(['scale2x', 'scale3x', 'mmpx'] as const)('%s output holds only input indexes', (algorithm) => {
    const step = { scale2x, scale3x, mmpx }[algorithm];
    for (let seed = 1; seed <= 25; seed++) {
      const image = randomImage(seed, 11, 7, 6);
      const known = values(image.pixels);
      for (const value of step(image, CONFIG).pixels) expect(known.has(value)).toBe(true);
    }
  });
});
