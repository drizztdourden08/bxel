/* @layer tests @kind test */
import { createTrail, extendTrail, pixelPerfect, strokePoints } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import { describe, expect, it } from 'vitest';
import { randomPoints } from './random-points';

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];

describe('the incremental pixel perfect trail', () => {
  it('keeps exactly what the whole path filter keeps after every point', () => {
    for (const seed of SEEDS) {
      const raw = randomPoints(seed, 120, 24);
      const trail = createTrail();
      raw.forEach((point, at) => {
        extendTrail(trail, point);
        expect(trail.kept).toEqual(pixelPerfect(strokePoints(raw.slice(0, at + 1))));
      });
    }
  });

  it('reports the tail that went and the tail that came, and nothing else', () => {
    for (const seed of SEEDS) {
      const trail = createTrail();
      for (const point of randomPoints(seed, 120, 24)) {
        const before: Point[] = trail.kept.slice();
        const change = extendTrail(trail, point);
        const settled = trail.kept.length - change.added.length;
        expect(trail.kept.slice(0, settled)).toEqual(before.slice(0, settled));
        expect(before.slice(settled)).toEqual([...change.removed].reverse());
        expect(trail.kept.slice(settled)).toEqual(change.added);
      }
    }
  });

  it('starts at the truncated first point and ignores a repeat of it', () => {
    const trail = createTrail();
    expect(extendTrail(trail, { x: 3, y: 2 }).added).toEqual([{ x: 3, y: 2 }]);
    expect(extendTrail(trail, { x: 3, y: 2 })).toEqual({ removed: [], added: [] });
  });

  it('drops the corner of an L the moment the diagonal step arrives', () => {
    const trail = createTrail();
    extendTrail(trail, { x: 0, y: 0 });
    extendTrail(trail, { x: 1, y: 0 });
    const change = extendTrail(trail, { x: 1, y: 1 });
    expect(change.removed).toEqual([{ x: 1, y: 0 }]);
    expect(trail.kept).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  });
});
