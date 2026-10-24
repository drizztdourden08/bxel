/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { collisionCorner } from '../../src/tilemap/collision/collision-corner';
import { collisionKind } from '../../src/tilemap/collision/collision-kind';
import { defaultCollision } from '../../src/tilemap/collision/default-collision';
import { nearestPoint } from '../../src/tilemap/collision/nearest-point';
import { outlinePoints } from '../../src/tilemap/collision/outline-points';
import { parsePoints } from '../../src/tilemap/collision/parse-points';
import { pointsText } from '../../src/tilemap/collision/points-text';
import { previewShape } from '../../src/tilemap/collision/preview-shape';
import { rectOfCorners } from '../../src/tilemap/collision/rect-of-corners';
import { setCollision } from '../../src/tilemap/set-collision';
import { openMapFile, tilesetNow } from './map-harness';

const TILE = { width: 2, height: 2 };

describe('collision editing helpers', () => {
  it('snaps a pointer offset to the nearest tile corner inside the tile', () => {
    expect(collisionCorner({ x: 13, y: -5 }, 8, { width: 4, height: 4 })).toEqual({ x: 2, y: 0 });
    expect(collisionCorner({ x: 400, y: 20 }, 8, { width: 4, height: 4 })).toEqual({ x: 4, y: 3 });
  });

  it('finds the point under the pointer within reach and none past it', () => {
    const points = [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }];
    expect(nearestPoint(points, { x: 7, y: 1 }, 1)).toBe(1);
    expect(nearestPoint(points, { x: 4, y: 4 }, 1)).toBe(-1);
  });

  it('builds a box from two corners and refuses a flat one', () => {
    expect(rectOfCorners({ x: 3, y: 1 }, { x: 1, y: 4 })).toEqual({ kind: 'rect', x: 1, y: 1, width: 2, height: 3 });
    expect(rectOfCorners({ x: 3, y: 1 }, { x: 3, y: 4 })).toBeNull();
  });

  it('reads and writes the point list as text', () => {
    const points = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }];
    expect(pointsText(points)).toBe('0,0 4,0 4,4');
    expect(parsePoints('0,0 4,0; 4,4')).toEqual(points);
    expect(parsePoints('0,0 four')).toBeNull();
    expect(parsePoints('-1,0')).toBeNull();
  });

  it('gives each kind a starting shape that covers the tile', () => {
    expect(defaultCollision('none', TILE)).toBeNull();
    expect(defaultCollision('full', TILE)).toEqual({ kind: 'full' });
    expect(defaultCollision('rect', TILE)).toEqual({ kind: 'rect', x: 0, y: 0, width: 2, height: 2 });
    expect(outlinePoints(defaultCollision('polygon', TILE) ?? { kind: 'full' }, TILE)).toHaveLength(4);
    expect(collisionKind(undefined)).toBe('none');
  });

  it('previews a dragged box and a dragged point without touching the stored shape', () => {
    const polygon = { kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }] } as const;
    const moved = previewShape(polygon, { kind: 'point', from: { x: 2, y: 0 }, to: { x: 1, y: 1 }, index: 1 });
    expect(moved).toEqual({ kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }] });
    expect(polygon.points[1]).toEqual({ x: 2, y: 0 });
    expect(previewShape({ kind: 'full' }, { kind: 'rect', from: { x: 0, y: 0 }, to: { x: 1, y: 2 }, index: -1 })).toEqual({
      kind: 'rect',
      x: 0,
      y: 0,
      width: 1,
      height: 2,
    });
  });
});

describe('setting a tile collision from the tileset panel', () => {
  beforeEach(() => openMapFile());

  it('sets a shape on the picked tile, as one document edit, and clears it again', () => {
    expect(setCollision(2, { kind: 'rect', x: 0, y: 1, width: 2, height: 1 })).toBe(true);
    expect(tilesetNow().tiles.find((tile) => tile.key === 2)?.collision).toEqual({ kind: 'rect', x: 0, y: 1, width: 2, height: 1 });
    expect(setCollision(2, null)).toBe(true);
    expect(tilesetNow().tiles.find((tile) => tile.key === 2)?.collision).toBeUndefined();
  });

  it('keeps a shape that does not fit out of the document', () => {
    expect(setCollision(2, { kind: 'rect', x: 0, y: 0, width: 9, height: 9 })).toBe(false);
    expect(tilesetNow().tiles.every((tile) => tile.collision === undefined)).toBe(true);
  });
});
