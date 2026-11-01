/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { emptyMask, transformMask, transformRegion } from '@bxel/raster';
import type { Orientation } from '@bxel/raster';
import { fromRows } from './from-rows';
import { maskFromRows } from './mask-from-rows';
import { maskRows } from './mask-rows';
import { toRows } from './to-rows';

const PIXELS = ['.....', '.123.', '.45..', '.....', '.....', '.....'];
const MASK = ['.....', '.###.', '.##..', '.....', '.....', '.....'];

const run = (rows: readonly string[], mask: readonly string[], orientation: Orientation) => {
  const target = fromRows(rows);
  const result = transformRegion({ target, mask: maskFromRows(mask), orientation });
  return { rows: toRows(target), result };
};

describe('K1 masked region transforms', { tags: ['critical'] }, () => {
  test('a flip moves the pixels inside the bounding box and vacates the old mask', () => {
    const { rows, result } = run(PIXELS, MASK, 'flip-horizontal');
    expect(rows).toEqual(['.....', '.321.', '..54.', '.....', '.....', '.....']);
    expect(result).toEqual({ rect: { x: 1, y: 1, width: 3, height: 2 }, clipped: 0 });
  });

  test('pixels outside the mask are never touched', () => {
    const { rows } = run(['.....', '.123.', '.45.7', '.....'], ['.....', '.###.', '.##..', '.....'], 'flip-horizontal');
    expect(rows).toEqual(['.....', '.321.', '..547', '.....']);
  });

  test('a clockwise turn keeps the top left corner of the bounding box', () => {
    const { rows, result } = run(PIXELS, MASK, 'turn-clockwise');
    expect(rows).toEqual(['.....', '.41..', '.52..', '..3..', '.....', '.....']);
    expect(result.clipped).toBe(0);
    expect(result.rect).toEqual({ x: 1, y: 1, width: 3, height: 3 });
  });

  test('a counter-clockwise turn and a half turn', () => {
    expect(run(PIXELS, MASK, 'turn-counter-clockwise').rows).toEqual(['.....', '.3...', '.25..', '.14..', '.....', '.....']);
    expect(run(PIXELS, MASK, 'half-turn').rows).toEqual(['.....', '..54.', '.321.', '.....', '.....', '.....']);
  });

  test('what falls outside the canvas is clipped and counted', () => {
    const { rows, result } = run(['.....', '.123.', '.45..'], ['.....', '.###.', '.##..'], 'turn-clockwise');
    expect(rows).toEqual(['.....', '.41..', '.52..']);
    expect(result.clipped).toBe(1);
  });

  test('an empty mask changes nothing', () => {
    const { rows, result } = run(PIXELS, ['.....', '.....', '.....', '.....', '.....', '.....'], 'turn-clockwise');
    expect(rows).toEqual(PIXELS);
    expect(result).toEqual({ rect: null, clipped: 0 });
  });

  test('a region of one colour that maps onto itself reports no change', () => {
    const { rows, result } = run(['.....', '.11..', '.11..', '.....'], ['.....', '.##..', '.##..', '.....'], 'turn-clockwise');
    expect(rows).toEqual(['.....', '.11..', '.11..', '.....']);
    expect(result.rect).toBeNull();
  });

  test('refuses a mask of another size', () => {
    const target = fromRows(PIXELS);
    expect(() => transformRegion({ target, mask: emptyMask({ width: 2, height: 2 }), orientation: 'half-turn' })).toThrow(RangeError);
  });
});

describe('K1 transformed masks', { tags: ['critical'] }, () => {
  test('follow the pixels they select', () => {
    const mask = maskFromRows(MASK);
    expect(maskRows(transformMask(mask, 'flip-horizontal'))).toEqual(['.....', '.###.', '..##.', '.....', '.....', '.....']);
    expect(maskRows(transformMask(mask, 'turn-clockwise'))).toEqual(['.....', '.##..', '.##..', '..#..', '.....', '.....']);
  });
});

describe('K1 region round trips', { tags: ['critical'] }, () => {
  const ORBITS: readonly (readonly [Orientation, number])[] = [
    ['turn-clockwise', 4],
    ['turn-counter-clockwise', 4],
    ['half-turn', 2],
    ['flip-horizontal', 2],
    ['flip-vertical', 2],
  ];

  test.each(ORBITS)('%s applied %i times restores pixels and mask', (orientation, times) => {
    const target = fromRows(PIXELS);
    let mask = maskFromRows(MASK);
    for (let step = 0; step < times; step++) {
      const result = transformRegion({ target, mask, orientation });
      expect(result.clipped).toBe(0);
      mask = transformMask(mask, orientation);
    }
    expect(toRows(target)).toEqual(PIXELS);
    expect(maskRows(mask)).toEqual(MASK);
  });
});
