/* @layer tests @kind test */
import { makeSampler, mmpx, scale2x, scale3x } from '@bxel/raster';
import type { IndexImage, ResampleAlgorithm, StepConfig } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import golden from './mmpx-golden.json';

const PALETTE_SIZE = 6;
const OPAQUE_FLAG = 256;

const brightness = (index: number): number => {
  if (index === 0) return OPAQUE_FLAG;
  const red = (index * 53) & 255;
  const green = (index * 97) & 255;
  const blue = (index * 29) & 255;
  return red + green + blue + 1;
};

const CONFIG: StepConfig = { border: 'transparent', same: (a, b) => a === b, luma: brightness };

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
  test.each(golden.map((each, at) => [at, each] as const))('golden sprite %i matches the reference output', (_at, each) => {
    expect(rowsOf(mmpx(imageOf(each.input), CONFIG))).toEqual(each.expected);
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

const sampleAll = (image: IndexImage, algorithm: ResampleAlgorithm): number[] => {
  const sampler = makeSampler({ image, algorithm, scale: 4, options: {} });
  const found: number[] = [];
  for (let v = 0; v < image.height; v += 0.21) {
    for (let u = 0; u < image.width; u += 0.19) found.push(sampler(u, v));
  }
  return found;
};

describe('palette closure', () => {
  test.each(ALGORITHMS)('%s only returns indexes found in its input', (algorithm) => {
    for (let seed = 1; seed <= 25; seed++) {
      const image = seed % 2 === 0 ? randomImage(seed, 10, 10, 5) : blobImage(seed);
      const known = values(image.pixels);
      expect(sampleAll(image, algorithm).every((value) => value === -1 || known.has(value))).toBe(true);
    }
  });

  test.each(['scale2x', 'scale3x', 'mmpx'] as const)('%s output holds only input indexes', (algorithm) => {
    const step = { scale2x, scale3x, mmpx }[algorithm];
    for (let seed = 1; seed <= 25; seed++) {
      const image = randomImage(seed, 11, 7, 6);
      const known = values(image.pixels);
      expect(Array.from(step(image, CONFIG).pixels).every((value) => known.has(value))).toBe(true);
    }
  });
});
