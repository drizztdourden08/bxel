/* @layer tests @kind test */
import { encodeBrushPixels } from '@bxel/document';
import type { Artwork, BrushId } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { errorOf, pixelEngine, request, stepOf } from './advanced-kit';
import { at, drawnOnEmpty, rowsAfter, scope } from './draw-kit';
import { brand } from './brand';
import { rampArtwork } from './ramp-artwork';
import { rowsArtwork } from './rows-artwork';

const BLOCK = ['.....', '.111.', '.111.', '.111.', '.....'];

describe('pixels.outline', () => {
  test('outside, 4 neighbour ring, leaves the corners open', () => {
    expect(rowsAfter(rowsArtwork(BLOCK), 'pixels.outline', { side: 'outside', ring: 4, index: 2 })).toEqual(['.222.', '21112', '21112', '21112', '.222.']);
  });

  test('outside, 8 neighbour ring, closes the corners', () => {
    expect(rowsAfter(rowsArtwork(BLOCK), 'pixels.outline', { side: 'outside', ring: 8, index: 2 })).toEqual(['22222', '21112', '21112', '21112', '22222']);
  });

  test('inside takes the edge pixels of the shape and keeps the middle', () => {
    expect(rowsAfter(rowsArtwork(BLOCK), 'pixels.outline', { side: 'inside', ring: 4, index: 2 })).toEqual(['.....', '.222.', '.212.', '.222.', '.....']);
  });

  test('sel-out takes the darker ramp step, of the pixel it touches outside and of the pixel itself inside', () => {
    const outside = rowsAfter(rampArtwork(['....', '.3..', '....']), 'pixels.outline', { side: 'outside', ring: 4, selOut: true });
    expect(outside).toEqual(['.2..', '232.', '.2..']);
    const inside = rowsAfter(rampArtwork(['33', '33']), 'pixels.outline', { side: 'inside', ring: 4, selOut: true });
    expect(inside).toEqual(['22', '22']);
  });

  test('wrap lets the outline cross the seam', () => {
    expect(rowsAfter(rowsArtwork(['3...']), 'pixels.outline', { side: 'outside', ring: 4, index: 1, wrap: { x: true } })).toEqual(['31.1']);
    expect(rowsAfter(rowsArtwork(['3...']), 'pixels.outline', { side: 'outside', ring: 4, index: 1 })).toEqual(['31..']);
  });

  test('refuses an outline with no colour and no sel-out', () => {
    const failed = pixelEngine(rowsArtwork(BLOCK)).execute(request([stepOf('pixels.outline', scope, { side: 'outside' })]));
    expect(errorOf(failed).code).toBe('INVALID_OPTION');
  });
});

describe('the line brush', () => {
  const dot = (angle: number) => drawnOnEmpty(5, 5, 'pixels.paint', { points: [at(2, 2)], index: 2, brush: { shape: 'line', size: 3, angle } });

  test('covers a one pixel line through the point at each angle', () => {
    expect(dot(0)).toEqual(['.....', '.....', '.222.', '.....', '.....']);
    expect(dot(90)).toEqual(['.....', '..2..', '..2..', '..2..', '.....']);
    expect(dot(45)).toEqual(['.....', '...2.', '..2..', '.2...', '.....']);
    expect(dot(135)).toEqual(['.....', '.2...', '..2..', '...2.', '.....']);
  });
});

describe('a cubic curve', () => {
  const cubic = () => drawnOnEmpty(9, 7, 'pixels.shape', { shape: 'curve', from: at(0, 0), control: at(0, 6), control2: at(8, 6), to: at(8, 0), index: 2 });

  test('runs from end to end, bows to the handles and is mirror symmetric for mirrored handles', () => {
    const rows = cubic();
    expect(rows[0]?.[0]).toBe('2');
    expect(rows[0]?.[8]).toBe('2');
    expect(rows[5]?.[4]).toBe('2');
    expect(rows[6]).toBe('.........');
    for (const row of rows) expect(row).toBe([...row].reverse().join(''));
  });

  test('differs from the quadratic curve over the first three points', () => {
    const quadratic = drawnOnEmpty(9, 7, 'pixels.shape', { shape: 'curve', from: at(0, 0), control: at(0, 6), to: at(8, 0), index: 2 });
    expect(quadratic).not.toEqual(cubic());
  });
});

describe('the pattern ink', () => {
  const brushId = brand<BrushId>('brs_000001');
  const withPattern = (rows: readonly string[], pixels: readonly number[]): Artwork => ({
    ...rowsArtwork(rows),
    brushes: [{ id: brushId, name: 'Pattern', width: pixels.length, height: 1, pixels: encodeBrushPixels(Uint8Array.from(pixels)) }],
  });
  const stroke = { points: [at(0, 0), at(5, 0)], index: 1 };

  test('paints the saved brush as a pattern that repeats from the canvas or from the origin', () => {
    const pattern = withPattern(['......'], [2, 3]);
    expect(rowsAfter(pattern, 'pixels.paint', { ...stroke, ink: { kind: 'pattern', brushId, originX: 0, originY: 0 } })).toEqual(['232323']);
    expect(rowsAfter(pattern, 'pixels.paint', { ...stroke, ink: { kind: 'pattern', brushId, originX: 1, originY: 0 } })).toEqual(['323232']);
  });

  test('keeps the pixels where the brush is empty', () => {
    expect(rowsAfter(withPattern(['444444'], [2, 0]), 'pixels.paint', { ...stroke, ink: { kind: 'pattern', brushId } })).toEqual(['242424']);
  });

  test('refuses a brush that does not exist', () => {
    const failed = pixelEngine(rowsArtwork(['......'])).execute(request([stepOf('pixels.paint', scope, { ...stroke, ink: { kind: 'pattern', brushId: 'brs_000099' } })]));
    expect(errorOf(failed).code).toBe('TARGET_NOT_FOUND');
  });
});

describe('shading with the ink and with pixels.shade', () => {
  const ROWS = ['1.23', '4.56', '....'];
  const across = [at(0, 0), at(3, 0)];

  test('the ink and the command move the same pixels the same way along the ramp', () => {
    const viaInk = rowsAfter(rampArtwork(ROWS), 'pixels.paint', { points: across, index: 1, ink: { kind: 'shade', ramp: 'Violet', direction: 'up' } });
    const viaCommand = rowsAfter(rampArtwork(ROWS), 'pixels.shade', { ramp: 'Violet', points: across, direction: 'up', brush: { shape: 'square', size: 1 } });
    expect(viaCommand).toEqual(['2.34', '4.56', '....']);
    expect(viaInk).toEqual(viaCommand);
  });

  test('down matches too, and stops at the ends of the ramp', () => {
    const viaInk = rowsAfter(rampArtwork(ROWS), 'pixels.paint', { points: across, index: 1, ink: { kind: 'shade', ramp: 'Violet', direction: 'down' } });
    const viaCommand = rowsAfter(rampArtwork(ROWS), 'pixels.shade', { ramp: 'Violet', points: across, direction: 'down', brush: { shape: 'square', size: 1 } });
    expect(viaCommand).toEqual(['1.12', '4.56', '....']);
    expect(viaInk).toEqual(viaCommand);
  });
});
