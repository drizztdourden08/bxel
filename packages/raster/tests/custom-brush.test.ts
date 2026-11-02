/* @layer tests @kind test */
import { encodeBrushPixels } from '@bxel/document';
import type { Artwork, BrushId } from '@bxel/document';
import { paintStroke } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { errorOf, pixelEngine, request, stepOf } from './advanced-kit';
import { blankBuffer } from './blank-buffer';
import { brand } from './brand';
import { at, rowsAfter, scope } from './draw-kit';
import { rowsArtwork } from './rows-artwork';
import { toRows } from './to-rows';

const brushId = brand<BrushId>('brs_000001');

const withBrush = (rows: readonly string[], width: number, height: number, pixels: readonly number[]): Artwork => ({
  ...rowsArtwork(rows),
  brushes: [{ id: brushId, name: 'Tip', width, height, pixels: encodeBrushPixels(Uint8Array.from(pixels)) }],
});

describe('K1 brush spacing', { tags: ['critical'] }, () => {
  test('lays a stamp every spacing pixels along the stroke', () => {
    const target = blankBuffer(9, 1);
    paintStroke({ target, points: [at(0, 0), at(8, 0)], index: 2, brush: { shape: 'square', size: 1, spacing: 4 } });
    expect(toRows(target)).toEqual(['2...2...2']);
  });

  test('a spacing of 1 paints every pixel', () => {
    const target = blankBuffer(4, 1);
    paintStroke({ target, points: [at(0, 0), at(3, 0)], index: 2, brush: { shape: 'square', size: 1, spacing: 1 } });
    expect(toRows(target)).toEqual(['2222']);
  });
});

describe('K1 the custom brush tip', { tags: ['critical'] }, () => {
  const art = withBrush(['.......', '.......', '.......'], 3, 3, [0, 5, 0, 5, 5, 5, 0, 5, 0]);

  test('pixels.paint stamps the shape of the saved brush in the ink colour', () => {
    expect(rowsAfter(art, 'pixels.paint', { points: [at(3, 1)], index: 2, brush: { shape: 'custom', brushId } })).toEqual(['...2...', '..222..', '...2...']);
  });

  test('spacing applies to the custom tip too', () => {
    const rows = rowsAfter(withBrush(['.........', '.........', '.........'], 3, 3, [0, 5, 0, 5, 5, 5, 0, 5, 0]), 'pixels.paint', {
      points: [at(1, 1), at(7, 1)],
      index: 2,
      brush: { shape: 'custom', brushId, spacing: 6 },
    });
    expect(rows).toEqual(['.2.....2.', '222...222', '.2.....2.']);
  });

  test('a saved pattern id resolves like a brush id', () => {
    const base = withBrush(['.......', '.......', '.......'], 3, 3, [0, 5, 0, 5, 5, 5, 0, 5, 0]);
    const patternId = 'pat_000001';
    const art2 = { ...base, brushes: [], patterns: [{ id: patternId, name: 'Cross', width: 3, height: 3, pixels: encodeBrushPixels(Uint8Array.from([0, 5, 0, 5, 5, 5, 0, 5, 0])) }] } as unknown as Artwork;
    expect(rowsAfter(art2, 'pixels.paint', { points: [at(3, 1)], index: 2, brush: { shape: 'custom', brushId: patternId } })).toEqual(['...2...', '..222..', '...2...']);
  });

  test('refuses a saved brush that does not exist', () => {
    const failed = pixelEngine(rowsArtwork(['.....'])).execute(request([stepOf('pixels.paint', scope, { points: [at(1, 0)], index: 1, brush: { shape: 'custom', brushId: 'brs_000099' } })]));
    expect(errorOf(failed).code).toBe('TARGET_NOT_FOUND');
  });

  test('refuses a spacing past 64', () => {
    const failed = pixelEngine(art).execute(request([stepOf('pixels.paint', scope, { points: [at(1, 1)], index: 1, brush: { shape: 'custom', brushId, spacing: 65 } })]));
    expect(errorOf(failed).code).toBe('INVALID_OPTION');
  });
});
