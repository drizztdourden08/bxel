/* @layer tests @kind bench */
import { paintStroke } from '@bxel/raster';
import type { Brush, Point } from '@bxel/raster';
import { bench, describe } from 'vitest';
import { wanderPoints } from './bench-points';

const HEAVY = { iterations: 5, time: 0, warmupIterations: 2, warmupTime: 0 };

type Spec = { readonly name: string; readonly side: number; readonly brush: Brush; readonly points: readonly Point[] };

const specs: readonly Spec[] = [
  { name: '64 px square brush, 8192 points, 2048 sprite (target 250 ms)', side: 2048, brush: { shape: 'square', size: 64 }, points: wanderPoints(8192, 2048) },
  { name: '64 px circle brush, 8192 points, 2048 sprite (target 250 ms)', side: 2048, brush: { shape: 'circle', size: 64 }, points: wanderPoints(8192, 2048) },
  { name: '4 px circle brush, 256 points, 256 sprite (target 2 ms)', side: 256, brush: { shape: 'circle', size: 4 }, points: wanderPoints(256, 256) },
];

describe('paint stroke rasterizer', () => {
  for (const spec of specs) {
    const target = { pixels: new Uint8Array(spec.side * spec.side), width: spec.side, height: spec.side };
    let index = 1;
    bench(
      spec.name,
      () => {
        index = index === 1 ? 2 : 1;
        paintStroke({ target, index, points: spec.points, brush: spec.brush });
      },
      HEAVY,
    );
  }
});
