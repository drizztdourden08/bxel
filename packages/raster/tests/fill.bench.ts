/* @layer tests @kind bench */
import { floodFill } from '@bxel/raster';
import type { BufferView, Connectivity, FillMode } from '@bxel/raster';
import { bench, describe } from 'vitest';

const SIDE = 2048;
const TARGET_MS = 100;
const HEAVY = { iterations: 5, time: 0, warmupIterations: 2, warmupTime: 0 };

const blank = (): BufferView => ({ pixels: new Uint8Array(SIDE * SIDE), width: SIDE, height: SIDE });

const checker = (): BufferView => {
  const view = blank();
  for (let y = 0; y < SIDE; y++) {
    for (let x = (y & 1) ^ 1; x < SIDE; x += 2) view.pixels[y * SIDE + x] = 1;
  }
  return view;
};

type Spec = { readonly name: string; readonly target: BufferView; readonly mode: FillMode; readonly reach: Connectivity };

const specs: readonly Spec[] = [
  { name: 'contiguous 4-way on a blank sprite', target: blank(), mode: 'contiguous', reach: 4 },
  { name: 'contiguous 8-way on a blank sprite', target: blank(), mode: 'contiguous', reach: 8 },
  { name: 'contiguous 8-way on a checkerboard (worst case)', target: checker(), mode: 'contiguous', reach: 8 },
  { name: 'global on a blank sprite', target: blank(), mode: 'global', reach: 4 },
];

const flip = (spec: Spec): void => {
  const flipped = spec.target.pixels[0] === 0 ? 3 : 0;
  floodFill({ target: spec.target, seed: { x: 0, y: 0 }, index: flipped, mode: spec.mode, connectivity: spec.reach });
};

describe(`flood fill, 2048 by 2048, target ${TARGET_MS} ms`, () => {
  for (const spec of specs) bench(spec.name, () => flip(spec), HEAVY);
});
