/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { nudgeShape } from '../../src/tilemap/collision/nudge-shape';
import { shapeWithoutPoint } from '../../src/tilemap/collision/shape-without-point';
import { snapStep } from '../../src/tilemap/collision/snap-step';
import { snapTo } from '../../src/tilemap/collision/snap-to';
import { STEP_OF } from '../../src/tilemap/move-tile.constants';

const SIZE = { width: 8, height: 8 };
const TRIANGLE = { kind: 'polygon', layer: 'solid', points: [{ x: 0, y: 8 }, { x: 8, y: 8 }, { x: 8, y: 0 }] } as const;

describe('K1 collision snap, nudge and point delete', { tags: ['critical'] }, () => {
  it('snaps to whole or half pixels and stays inside the tile', () => {
    expect(snapTo(2.3, 'pixel', 8)).toBe(2);
    expect(snapTo(2.3, 'half', 8)).toBe(2.5);
    expect(snapTo(-4, 'half', 8)).toBe(0);
    expect(snapTo(99, 'pixel', 8)).toBe(8);
    expect([snapStep('pixel'), snapStep('half')]).toEqual([1, 0.5]);
  });

  it('nudges one point, a whole polygon or a box, and clamps at the tile edge', () => {
    expect(nudgeShape(TRIANGLE, 0, { x: 1, y: -1 }, SIZE)).toEqual({ ...TRIANGLE, points: [{ x: 1, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 0 }] });
    expect(nudgeShape(TRIANGLE, null, { x: 10, y: 0 }, SIZE)).toEqual({ ...TRIANGLE, points: [{ x: 8, y: 8 }, { x: 8, y: 8 }, { x: 8, y: 0 }] });
    const box = { kind: 'rect', layer: 'solid', x: 6, y: 0, width: 2, height: 2 } as const;
    expect(nudgeShape(box, null, { x: 5, y: 0.5 }, SIZE)).toEqual({ ...box, x: 6, y: 0.5 });
    expect(nudgeShape({ kind: 'full', layer: 'solid' }, null, { x: 1, y: 1 }, SIZE)).toEqual({ kind: 'full', layer: 'solid' });
  });

  it('deletes a point only from a polygon that keeps three', () => {
    const square = { ...TRIANGLE, points: [...TRIANGLE.points, { x: 0, y: 0 }] };
    expect(shapeWithoutPoint(square, 3)).toEqual(TRIANGLE);
    expect(shapeWithoutPoint(TRIANGLE, 0)).toBeNull();
    expect(shapeWithoutPoint(square, null)).toBeNull();
    expect(shapeWithoutPoint({ kind: 'full', layer: 'solid' }, 0)).toBeNull();
  });

  it('steps the layout by one cell or one row', () => {
    expect([STEP_OF.left(7), STEP_OF.right(7), STEP_OF.up(7), STEP_OF.down(7)]).toEqual([-1, 1, -7, 7]);
  });
});
