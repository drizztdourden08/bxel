/* @layer core @kind logic */
import { mmpxCorners } from './mmpx-corners';
import { mmpxShallow } from './mmpx-shallow';
import { mmpxSlopes } from './mmpx-slopes';
import type { Hood, Quad } from './mmpx.type';
import { readPixel } from './read-pixel';
import type { IndexImage, StepConfig } from './resample.type';

const hoodAt = (image: IndexImage, x: number, y: number, config: StepConfig): Hood => {
  const at = (dx: number, dy: number): number => readPixel(image, x + dx, y + dy, config.border);
  return {
    a: at(-1, -1), b: at(0, -1), c: at(1, -1),
    d: at(-1, 0), e: at(0, 0), f: at(1, 0),
    g: at(-1, 1), h: at(0, 1), i: at(1, 1),
    p: at(0, -2), q: at(-2, 0), r: at(2, 0), s: at(0, 2),
    at,
    luma: config.luma,
  };
};

const isFlat = (n: Hood): boolean => [n.a, n.b, n.c, n.d, n.f, n.g, n.h, n.i].every((value) => value === n.e);

/**
 * MMPX 2x magnification (McGuire and Gagiu, JCGT 2021, MIT licensed reference code).
 * Only values found in the input reach the output. Equality is exact; luma breaks ties.
 */
const mmpx = (image: IndexImage, config: StepConfig): IndexImage => {
  const { width, height } = image;
  const out = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const n = hoodAt(image, x, y, config);
      const quad: Quad = { j: n.e, k: n.e, l: n.e, m: n.e };
      if (!isFlat(n)) {
        mmpxSlopes(n, quad);
        mmpxCorners(n, quad);
        mmpxShallow(n, quad);
      }
      const at = y * 2 * width * 2 + x * 2;
      out[at] = quad.j;
      out[at + 1] = quad.k;
      out[at + width * 2] = quad.l;
      out[at + width * 2 + 1] = quad.m;
    }
  }
  return { width: width * 2, height: height * 2, pixels: out };
};

export { mmpx };
