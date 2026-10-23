/* @layer core @kind test */
import {
  clipRect,
  flipPivot,
  flipPoint,
  mirrorCoordinate,
  trimPivot,
  turnPivot,
  turnPoint,
  unionRect,
} from '@bxel/document';
import type { Pivot2, Point, Size, TurnDirection } from '@bxel/document';
import { describe, expect, it } from 'vitest';

const size: Size = { width: 3, height: 2 };
const pivot: Pivot2 = { x2: 1, y2: 3 };
const origin: Point = { x: 0, y: 0 };

const allPoints = (box: Size): Point[] =>
  Array.from({ length: box.width * box.height }, (_, index) => ({ x: index % box.width, y: Math.floor(index / box.width) }));

const turned = (box: Size, direction: TurnDirection): Size =>
  direction === 'half' ? box : { width: box.height, height: box.width };

describe('geometry tables on a 3 x 2 sprite', () => {
  it('flips', () => {
    expect(flipPoint(origin, size, 'horizontal')).toEqual({ x: 2, y: 0 });
    expect(flipPivot(pivot, size, 'horizontal')).toEqual({ x2: 5, y2: 3 });
    expect(flipPoint(origin, size, 'vertical')).toEqual({ x: 0, y: 1 });
    expect(flipPivot(pivot, size, 'vertical')).toEqual({ x2: 1, y2: 1 });
  });

  it('turns', () => {
    expect(turnPoint(origin, size, 'clockwise')).toEqual({ x: 1, y: 0 });
    expect(turnPivot(pivot, size, 'clockwise')).toEqual({ x2: 1, y2: 1 });
    expect(turnPoint(origin, size, 'counter-clockwise')).toEqual({ x: 0, y: 2 });
    expect(turnPivot(pivot, size, 'counter-clockwise')).toEqual({ x2: 3, y2: 5 });
    expect(turnPoint(origin, size, 'half')).toEqual({ x: 2, y: 1 });
    expect(turnPivot(pivot, size, 'half')).toEqual({ x2: 5, y2: 1 });
  });

  it('returns pixels and pivot bit for bit after four turns', () => {
    for (const direction of ['clockwise', 'counter-clockwise'] as const) {
      for (const point of allPoints(size)) {
        let current = point;
        let currentPivot = pivot;
        let box = size;
        for (let turn = 0; turn < 4; turn += 1) {
          current = turnPoint(current, box, direction);
          currentPivot = turnPivot(currentPivot, box, direction);
          box = turned(box, direction);
        }
        expect(current).toEqual(point);
        expect(currentPivot).toEqual(pivot);
      }
    }
  });

  it('returns pixels and pivot after two flips and two half turns', () => {
    for (const point of allPoints(size)) {
      const flipped = flipPoint(flipPoint(point, size, 'horizontal'), size, 'horizontal');
      const around = turnPoint(turnPoint(point, size, 'half'), size, 'half');
      expect(flipped).toEqual(point);
      expect(around).toEqual(point);
    }
    expect(flipPivot(flipPivot(pivot, size, 'vertical'), size, 'vertical')).toEqual(pivot);
    expect(turnPivot(turnPivot(pivot, size, 'half'), size, 'half')).toEqual(pivot);
  });
});

describe('geometry buffers and rectangles', () => {
  it('moves a buffer to the turned layout without losing a pixel', () => {
    const source = Uint8Array.from([1, 2, 3, 4, 5, 6]);
    const target = new Uint8Array(6);
    for (const [index, value] of source.entries()) {
      const next = turnPoint({ x: index % 3, y: Math.floor(index / 3) }, size, 'clockwise');
      target[next.y * size.height + next.x] = value;
    }
    expect(Array.from(target)).toEqual([4, 1, 5, 2, 6, 3]);
  });

  it('mirrors, trims, clips and unions', () => {
    expect(mirrorCoordinate(8, 2)).toBe(5);
    expect(trimPivot({ x2: 9, y2: 7 }, { x: 2, y: 1, width: 3, height: 3 })).toEqual({ x2: 5, y2: 5 });
    expect(clipRect({ x: -1, y: 0, width: 3, height: 5 }, size)).toEqual({ x: 0, y: 0, width: 2, height: 2 });
    expect(clipRect({ x: 5, y: 5, width: 1, height: 1 }, size)).toBeNull();
    expect(unionRect({ x: 0, y: 0, width: 1, height: 1 }, { x: 2, y: 3, width: 2, height: 1 })).toEqual({
      x: 0,
      y: 0,
      width: 4,
      height: 4,
    });
  });
});
