/* @layer tests @kind test */
import { clearRegion, landRegion, maskBounds, moveMover, replaceIndex, scaleBuffer, scaleMover } from '@bxel/raster';
import type { MaskView, Mover } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { fromRows } from './from-rows';
import { maskFromRows } from './mask-from-rows';
import { toRows } from './to-rows';

const PIVOT = { x2: 0, y2: 0 };

const land = (rows: readonly string[], mask: MaskView, mover: Mover, skipZero = false) => {
  const target = fromRows(rows);
  const box = maskBounds(mask);
  if (!box) throw new Error('the mask is empty');
  const result = landRegion({ target, mask, resample: mover({ mask, box, pivot: PIVOT }), skipZero });
  return { rows: toRows(target), ...result };
};

describe('replaceIndex', () => {
  test('replaces every pixel of one index and counts them', () => {
    const target = fromRows(['1122', '2211', '3333']);
    const result = replaceIndex({ target, from: 2, to: 5 });
    expect(toRows(target)).toEqual(['1155', '5511', '3333']);
    expect(result.count).toBe(4);
    expect(result.rect).toEqual({ x: 0, y: 0, width: 4, height: 2 });
  });

  test('stays inside a mask', () => {
    const target = fromRows(['1122', '2211']);
    const result = replaceIndex({ target, from: 2, to: 5, mask: maskFromRows(['..##', '....']) });
    expect(toRows(target)).toEqual(['1155', '2211']);
    expect(result.count).toBe(2);
  });

  test('the same index in and out changes nothing', () => {
    const target = fromRows(['12']);
    expect(replaceIndex({ target, from: 1, to: 1 })).toEqual({ rect: null, count: 0 });
  });
});

describe('clearRegion', () => {
  test('clears the masked pixels and reports their box', () => {
    const target = fromRows(['123', '456']);
    expect(clearRegion(target, maskFromRows(['.##', '#..']))).toEqual({ x: 0, y: 0, width: 3, height: 2 });
    expect(toRows(target)).toEqual(['1..', '.56']);
  });

  test('clears everything without a mask and ignores empty pixels', () => {
    const target = fromRows(['1.3']);
    expect(clearRegion(target)).toEqual({ x: 0, y: 0, width: 3, height: 1 });
    expect(toRows(target)).toEqual(['...']);
    expect(clearRegion(target)).toBeNull();
  });
});

describe('moveMover', () => {
  const rows = ['.....', '.12..', '.34..'];
  const mask = maskFromRows(['.....', '.##..', '.##..']);

  test('lifts the region and drops it at the offset', () => {
    const result = land(rows, mask, moveMover({ x: 2, y: -1 }));
    expect(result.rows).toEqual(['...12', '...34', '.....']);
    expect(result.clipped).toBe(0);
  });

  test('counts what leaves the buffer', () => {
    const result = land(rows, mask, moveMover({ x: 3, y: 0 }));
    expect(result.rows).toEqual(['.....', '....1', '....3']);
    expect(result.clipped).toBe(2);
  });

  test('overlapping moves keep the lifted values', () => {
    expect(land(rows, mask, moveMover({ x: 1, y: 0 })).rows).toEqual(['.....', '..12.', '..34.']);
  });

  test('skipZero leaves the destination under empty pixels', () => {
    const sparse = ['.....', '.1...', '.....', '..5..'];
    const hole = maskFromRows(['.....', '.##..', '.##..', '.....']);
    const down = moveMover({ x: 0, y: 1 });
    expect(land(sparse, hole, down, true).rows).toEqual(['.....', '.....', '.1...', '..5..']);
    expect(land(sparse, hole, down, false).rows).toEqual(['.....', '.....', '.1...', '.....']);
  });
});

describe('scaleMover', () => {
  const rows = ['......', '.12...', '.34...', '......', '......', '......'];
  const mask = maskFromRows(['......', '.##...', '.##...', '......', '......', '......']);

  test('an integer factor equals the plain nearest neighbour scale', () => {
    const result = land(rows, mask, scaleMover({ target: { by: 'factor', x: 2, y: 2 }, anchor: 'top-left' }));
    const plain = scaleBuffer(fromRows(['12', '34']), 2);
    expect(result.rows.slice(1, 5).map((row) => row.slice(1, 5))).toEqual(toRows(plain));
    expect(result.clipped).toBe(0);
  });

  test('a size target samples the cell centres when shrinking', () => {
    const wide = ['1234', '5612', '3456', '1234'];
    const all = maskFromRows(['####', '####', '####', '####']);
    const result = land(wide, all, scaleMover({ target: { by: 'size', width: 2, height: 2 }, anchor: 'top-left' }));
    expect(result.rows).toEqual(['62..', '24..', '....', '....']);
  });

  test('a centre anchor grows the region about its middle', () => {
    const result = land(rows, mask, scaleMover({ target: { by: 'size', width: 4, height: 4 }, anchor: 'center' }));
    expect(result.rows).toEqual(['1122..', '1122..', '3344..', '3344..', '......', '......']);
  });

  test('a bottom right anchor grows up and left and counts the clipped cells', () => {
    const result = land(rows, mask, scaleMover({ target: { by: 'size', width: 4, height: 4 }, anchor: 'bottom-right' }));
    expect(result.rows).toEqual(['122...', '344...', '344...', '......', '......', '......']);
    expect(result.clipped).toBe(7);
  });

  test('an unusual size resamples without gaps', () => {
    const result = land(rows, mask, scaleMover({ target: { by: 'size', width: 3, height: 1 }, anchor: 'top-left' }));
    expect(result.rows.slice(0, 3)).toEqual(['......', '.344..', '......']);
  });
});
