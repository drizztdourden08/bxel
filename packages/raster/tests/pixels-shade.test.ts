/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { celRows, errorOf, expectLockedInk, expectOneUndo, expectPreviewEqualsCommit, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { heartIds, heartArtwork } from './heart-artwork';
import { rampArtwork, withRamps } from './ramp-artwork';
import { rowsIds } from './rows-artwork';

const ROWS = ['1.23', '4.56', '....'];
const scope = scopeOf([rowsIds.sprite]);
const BRUSH = { shape: 'square', size: 1 } as const;
const across = (y: number) => [{ x: 0, y }, { x: 3, y }];
const shade = (extra: Record<string, unknown>) => stepOf('pixels.shade', scope, { ramp: 'Violet', points: across(0), brush: BRUSH, ...extra });
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel);

describe('pixels.shade', () => {
  test('steps the stroke one place up the ramp as one undo step', () => {
    const engine = pixelEngine(rampArtwork(ROWS));
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([shade({ direction: 'up' })])));
    expect(rowsOf(engine)).toEqual(['2.34', '4.56', '....']);
    expect(result.changes.sprites[0]?.cels[0]?.rect).toEqual({ x: 0, y: 0, width: 4, height: 1 });
    expectOneUndo(engine, original);
  });

  test('steps down, several places at a time, and stops at the ends', () => {
    const down = pixelEngine(rampArtwork(ROWS));
    okOf(down.execute(request([shade({ direction: 'down' })])));
    expect(rowsOf(down)).toEqual(['1.12', '4.56', '....']);
    const far = pixelEngine(rampArtwork(ROWS));
    okOf(far.execute(request([shade({ direction: 'up', steps: 2 })])));
    expect(rowsOf(far)).toEqual(['3.44', '4.56', '....']);
  });

  test('leaves indices that are not on the ramp and empty pixels alone', () => {
    const engine = pixelEngine(rampArtwork(ROWS));
    okOf(engine.execute(request([shade({ direction: 'up', points: across(1) })])));
    expect(rowsOf(engine)).toEqual(['1.23', '4.56', '....']);
    expect(engine.state().revision).toBe(1);
  });

  test('a thick brush steps each pixel once and a mask limits the stroke', () => {
    const engine = pixelEngine(rampArtwork(ROWS));
    const mask = maskFromRows(['.##.', '....', '....']);
    okOf(engine.execute(request([shade({ direction: 'up', mask, brush: { shape: 'square', size: 2 }, points: across(0) })])));
    expect(rowsOf(engine)).toEqual(['1.33', '4.56', '....']);
  });

});

describe('pixels.shade ramps and guards', () => {
  test('matches the ramp name without regard to case', () => {
    const engine = pixelEngine(rampArtwork(ROWS));
    okOf(engine.execute(request([shade({ direction: 'up', ramp: ' violet ' })])));
    expect(rowsOf(engine)).toEqual(['2.34', '4.56', '....']);
  });

  test('refuses a ramp that is missing or holds no colours', () => {
    const engine = pixelEngine(rampArtwork(ROWS));
    for (const ramp of ['Nope', 'Empty']) {
      const error = errorOf(engine.execute(request([shade({ direction: 'up', ramp })])));
      expect(error.code).toBe('TARGET_NOT_FOUND');
      expect(error.details[0]?.spriteId).toBe(rowsIds.sprite);
    }
    expect(engine.state().revision).toBe(1);
  });

  test('refuses bad options and too many points', () => {
    const engine = pixelEngine(rampArtwork(ROWS));
    expect(errorOf(engine.execute(request([shade({ direction: 'sideways' })]))).code).toBe('INVALID_OPTION');
    expect(errorOf(engine.execute(request([shade({ direction: 'up', steps: 0 })]))).code).toBe('INVALID_OPTION');
    const many = Array.from({ length: 8193 }, () => ({ x: 0, y: 0 }));
    expect(errorOf(engine.execute(request([shade({ direction: 'up', points: many })]))).code).toBe('BATCH_TOO_LARGE');
  });

  test('shades several sprites by name and refuses a locked layer by id', () => {
    const engine = pixelEngine(withRamps(heartArtwork()));
    const names = scopeOf([heartIds.heart, heartIds.heartB], { by: 'names', names: ['Body'] });
    const points = [{ x: 0, y: 1 }, { x: 7, y: 1 }];
    const result = okOf(engine.execute(request([stepOf('pixels.shade', names, { ramp: 'Violet', direction: 'up', points })])));
    expect(result.changes.sprites).toHaveLength(2);
    expectLockedInk('pixels.shade', { ramp: 'Violet', direction: 'up', points });
  });

  test('preview equals commit', () => {
    expectPreviewEqualsCommit(rampArtwork(ROWS), shade({ direction: 'up' }));
  });
});
