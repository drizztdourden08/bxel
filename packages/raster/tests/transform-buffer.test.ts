/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { FLIP_ORIENTATION, TURN_ORIENTATION, scaleBuffer, transformBuffer, transformPivot, transformRect, transformSize } from '@bxel/raster';
import type { BufferView, Orientation } from '@bxel/raster';
import { contractPoint } from './contract-point';
import { fromRows } from './from-rows';
import { repeatTransform } from './repeat-transform';
import { toRows } from './to-rows';

type Golden = {
  readonly orientation: Orientation;
  readonly rows: readonly string[];
  readonly size: { readonly width: number; readonly height: number };
  readonly pivot: { readonly x2: number; readonly y2: number };
};

const SPRITE = ['123', '4.5'];
const SIZE = { width: 3, height: 2 };
const PIVOT = { x2: 1, y2: 4 };

const GOLDEN: readonly Golden[] = [
  { orientation: 'flip-horizontal', rows: ['321', '5.4'], size: SIZE, pivot: { x2: 5, y2: 4 } },
  { orientation: 'flip-vertical', rows: ['4.5', '123'], size: SIZE, pivot: { x2: 1, y2: 0 } },
  { orientation: 'turn-clockwise', rows: ['41', '.2', '53'], size: { width: 2, height: 3 }, pivot: { x2: 0, y2: 1 } },
  { orientation: 'turn-counter-clockwise', rows: ['35', '2.', '14'], size: { width: 2, height: 3 }, pivot: { x2: 4, y2: 5 } },
  { orientation: 'half-turn', rows: ['5.4', '321'], size: SIZE, pivot: { x2: 5, y2: 0 } },
];

const ALL: readonly Orientation[] = GOLDEN.map((entry) => entry.orientation);

const BIG = fromRows(['1234567', '8.12345', '6789...', '1.2.3.4']);

const same = (first: BufferView, second: BufferView): boolean =>
  first.width === second.width && first.height === second.height && first.pixels.every((value, at) => value === second.pixels[at]);

describe('lossless transforms of a whole buffer', () => {
  test.each(GOLDEN)('$orientation moves pixels, size and pivot by the contract table', ({ orientation, rows, size, pivot }) => {
    const moved = transformBuffer(fromRows(SPRITE), orientation);
    expect(toRows(moved)).toEqual(rows);
    expect({ width: moved.width, height: moved.height }).toEqual(size);
    expect(transformSize(orientation, SIZE)).toEqual(size);
    expect(transformPivot(orientation, SIZE, PIVOT)).toEqual(pivot);
  });

  test.each([
    ['turn-clockwise', 4],
    ['turn-counter-clockwise', 4],
    ['half-turn', 2],
    ['flip-horizontal', 2],
    ['flip-vertical', 2],
  ] as const)('%s repeated %i times returns pixels, size and pivot bit for bit', (orientation, times) => {
    const start = { view: fromRows(SPRITE), size: SIZE, pivot: PIVOT };
    const result = repeatTransform(start, orientation, times);
    expect(toRows(result.view)).toEqual(SPRITE);
    expect(result.size).toEqual(SIZE);
    expect(result.pivot).toEqual(PIVOT);
  });

  test('clockwise then counter-clockwise cancels, and two quarter turns equal a half turn', () => {
    const there = transformBuffer(transformBuffer(BIG, 'turn-clockwise'), 'turn-counter-clockwise');
    expect(same(there, BIG)).toBe(true);
    const twice = transformBuffer(transformBuffer(BIG, 'turn-clockwise'), 'turn-clockwise');
    expect(same(twice, transformBuffer(BIG, 'half-turn'))).toBe(true);
  });

  test('a flip and a half turn compose to the other flip', () => {
    const composed = transformBuffer(transformBuffer(BIG, 'flip-horizontal'), 'half-turn');
    expect(same(composed, transformBuffer(BIG, 'flip-vertical'))).toBe(true);
  });

  test.each(ALL)('%s agrees with the contract point mapping for every pixel', (orientation) => {
    const moved = transformBuffer(BIG, orientation);
    const size = { width: BIG.width, height: BIG.height };
    for (let y = 0; y < BIG.height; y++) {
      for (let x = 0; x < BIG.width; x++) {
        const target = contractPoint(orientation, { x, y }, size);
        expect(moved.pixels[target.y * moved.width + target.x]).toBe(BIG.pixels[y * BIG.width + x]);
      }
    }
  });

  test('never changes its input', () => {
    const view = fromRows(SPRITE);
    const copy = view.pixels.slice();
    for (const orientation of ALL) transformBuffer(view, orientation);
    expect(view.pixels).toEqual(copy);
  });

  test('the orientation names cover every document flip axis and turn direction', () => {
    expect(FLIP_ORIENTATION).toEqual({ horizontal: 'flip-horizontal', vertical: 'flip-vertical' });
    expect(TURN_ORIENTATION).toEqual({
      clockwise: 'turn-clockwise',
      'counter-clockwise': 'turn-counter-clockwise',
      half: 'half-turn',
    });
  });
});

describe('transformed rectangles', () => {
  const canvas = { width: 6, height: 4 };
  const rect = { x: 1, y: 0, width: 2, height: 3 };

  test('a flip mirrors the rectangle', () => {
    expect(transformRect('flip-horizontal', canvas, rect)).toEqual({ x: 3, y: 0, width: 2, height: 3 });
    expect(transformRect('flip-vertical', canvas, rect)).toEqual({ x: 1, y: 1, width: 2, height: 3 });
  });

  test('a turn swaps its extent', () => {
    expect(transformRect('turn-clockwise', canvas, rect)).toEqual({ x: 1, y: 1, width: 3, height: 2 });
    expect(transformRect('turn-counter-clockwise', canvas, rect)).toEqual({ x: 0, y: 3, width: 3, height: 2 });
  });
});

describe('integer scale', () => {
  test('repeats every pixel in a block', () => {
    expect(toRows(scaleBuffer(fromRows(SPRITE), 2))).toEqual(['112233', '112233', '44..55', '44..55']);
    expect(toRows(scaleBuffer(fromRows(['1.']), 3))).toEqual(['111...', '111...', '111...']);
  });

  test('a factor of one copies and below one is treated as one', () => {
    expect(toRows(scaleBuffer(fromRows(SPRITE), 1))).toEqual(SPRITE);
    expect(toRows(scaleBuffer(fromRows(SPRITE), 0))).toEqual(SPRITE);
  });
});
