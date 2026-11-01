/* @layer renderer-app @kind test */
import type { Point } from '@bxel/raster';
import { describe, expect, it } from 'vitest';
import { PLAIN_HOLD } from '../../src/editor/selection/incoming-mask.constants';
import { isMarqueeClick } from '../../src/editor/selection/is-marquee-click';
import { nextShape } from '../../src/editor/selection/next-shape';
import type { DragShape, MarqueeRule } from '../../src/editor/selection/selection.type';
import { shapeCorners } from '../../src/editor/selection/shape-corners';

const FREE: MarqueeRule = { fixed: 'free', width: 16, height: 16 };
const SIZE: MarqueeRule = { fixed: 'size', width: 6, height: 4 };
const RATIO: MarqueeRule = { fixed: 'ratio', width: 2, height: 1 };

const at = (x: number, y: number): Point => ({ x, y });

const shapeOf = (variant: DragShape['variant'], from: Point, to: Point, path: readonly Point[] = []): DragShape => ({ variant, from, to, path });

describe('K1 a marquee with a fixed size or a fixed ratio', { tags: ['critical'] }, () => {
  it('keeps the dragged box when the marquee is free', () => {
    expect(shapeCorners(at(2, 3), at(9, 7), PLAIN_HOLD, FREE)).toEqual({ from: at(2, 3), to: at(9, 7) });
  });

  it('stamps a box of the set size from the press point, whichever way the pointer drags', () => {
    expect(shapeCorners(at(10, 10), at(10, 10), PLAIN_HOLD, SIZE)).toEqual({ from: at(10, 10), to: at(15, 13) });
    expect(shapeCorners(at(10, 10), at(2, 2), PLAIN_HOLD, SIZE)).toEqual({ from: at(10, 10), to: at(5, 7) });
  });

  it('centres the fixed size box on the press point while Alt is held', () => {
    const corners = shapeCorners(at(10, 10), at(12, 12), { square: false, centre: true }, SIZE);
    expect(corners).toEqual({ from: at(7, 8), to: at(12, 11) });
  });

  it('keeps the width to height ratio of a dragged box', () => {
    const corners = shapeCorners(at(0, 0), at(9, 2), PLAIN_HOLD, RATIO);
    const width = corners.to.x - corners.from.x + 1;
    const height = corners.to.y - corners.from.y + 1;
    expect(width).toBe(height * 2);
  });

  it('never gives a box smaller than one pixel for a ratio', () => {
    const corners = shapeCorners(at(5, 5), at(5, 5), PLAIN_HOLD, RATIO);
    expect(corners.to.x).toBeGreaterThanOrEqual(corners.from.x);
    expect(corners.to.y).toBeGreaterThanOrEqual(corners.from.y);
  });

  it('treats a press without a drag as a click, except for a fixed size box that stamps', () => {
    expect(isMarqueeClick(shapeOf('rect', at(3, 3), at(3, 3)), FREE)).toBe(true);
    expect(isMarqueeClick(shapeOf('rect', at(3, 3), at(3, 3)), SIZE)).toBe(false);
    expect(isMarqueeClick(shapeOf('ellipse', at(3, 3), at(3, 3)), SIZE)).toBe(false);
    expect(isMarqueeClick(shapeOf('lasso', at(3, 3), at(3, 3)), SIZE)).toBe(true);
    expect(isMarqueeClick(shapeOf('rect', at(3, 3), at(4, 3)), SIZE)).toBe(false);
  });
});

describe('K1 the lasso with Alt held draws straight segments', { tags: ['critical'] }, () => {
  const ALT = { square: false, centre: true };

  it('adds every point of a free drag to the path', () => {
    let shape = shapeOf('lasso', at(0, 0), at(0, 0), [at(0, 0)]);
    shape = nextShape(shape, at(1, 0), PLAIN_HOLD);
    shape = nextShape(shape, at(2, 1), PLAIN_HOLD);
    expect(shape.path).toEqual([at(0, 0), at(1, 0), at(2, 1)]);
  });

  it('keeps one moving end while Alt is held, so the path is a straight segment from the last free point', () => {
    let shape = shapeOf('lasso', at(0, 0), at(0, 0), [at(0, 0)]);
    shape = nextShape(shape, at(2, 0), PLAIN_HOLD);
    shape = nextShape(shape, at(5, 3), ALT);
    shape = nextShape(shape, at(8, 6), ALT);
    expect(shape.path).toEqual([at(0, 0), at(2, 0), at(8, 6)]);
  });

  it('goes back to a free drag when Alt is released and keeps the straight segment', () => {
    let shape = shapeOf('lasso', at(0, 0), at(0, 0), [at(0, 0)]);
    shape = nextShape(shape, at(4, 0), ALT);
    shape = nextShape(shape, at(4, 4), PLAIN_HOLD);
    shape = nextShape(shape, at(5, 5), PLAIN_HOLD);
    expect(shape.path).toEqual([at(0, 0), at(4, 0), at(4, 4), at(5, 5)]);
  });

  it('only moves the end of a box shape, never its path', () => {
    const shape = nextShape(shapeOf('rect', at(1, 1), at(1, 1)), at(6, 6), ALT);
    expect(shape.to).toEqual(at(6, 6));
    expect(shape.path).toEqual([]);
  });
});
