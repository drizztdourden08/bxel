/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { celRows, errorOf, expectLockedInk, expectOneUndo, expectPreviewEqualsCommit, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { rowsIds, rowsArtwork } from './rows-artwork';
import { transformIds, transformArtwork } from './transform-artwork';

const PIXELS = ['.....', '.612.', '.34..', '.....', '.....', '.....'];
const MASK = maskFromRows(['.....', '.###.', '.##..', '.....', '.....', '.....']);
const scope = scopeOf([rowsIds.sprite]);
const move = (offset: { x: number; y: number }, extra: Record<string, unknown> = {}) =>
  stepOf('pixels.move', scope, { offset, mask: MASK, ...extra });
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel);

describe('pixels.move', () => {
  test('lifts the masked region and drops it at the offset as one undo step', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([move({ x: 0, y: 2 })])));
    expect(rowsOf(engine)).toEqual(['.....', '.....', '.....', '.612.', '.34..', '.....']);
    expect(result.warnings).toEqual([]);
    expectOneUndo(engine, original);
  });

  test('reports what falls off the sprite', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([move({ x: 3, y: 0 })])));
    expect(rowsOf(engine)).toEqual(['.....', '....6', '....3', '.....', '.....', '.....']);
    expect(result.warnings).toEqual([
      { code: 'PIXELS_CLIPPED', step: 0, message: '3 masked pixel(s) moved outside the sprite and were dropped.' },
    ]);
    expect(result.report).toEqual({ pixelsClipped: 3 });
    expectOneUndo(engine, original);
  });

  test('moves the whole cel when there is no mask', () => {
    const engine = pixelEngine(rowsArtwork(['123', '456']));
    const result = okOf(engine.execute(request([stepOf('pixels.move', scope, { offset: { x: 1, y: 0 } })])));
    expect(rowsOf(engine)).toEqual(['.12', '.45']);
    expect(result.warnings[0]?.message).toBe('2 masked pixel(s) moved outside the sprite and were dropped.');
  });

  test('a move that goes nowhere is a no-op', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    expect(okOf(engine.execute(request([move({ x: 0, y: 0 })]))).noop).toBe(true);
    expect(engine.state().revision).toBe(1);
  });

  test('skipZero keeps the destination under empty pixels', () => {
    const keep = pixelEngine(rowsArtwork(['1.5']));
    okOf(keep.execute(request([stepOf('pixels.move', scope, { offset: { x: 1, y: 0 }, mask: maskFromRows(['##.']), skipZero: true })])));
    expect(rowsOf(keep)).toEqual(['.15']);
    const write = pixelEngine(rowsArtwork(['1.5']));
    okOf(write.execute(request([stepOf('pixels.move', scope, { offset: { x: 2, y: 0 }, mask: maskFromRows(['#.#']), skipZero: false })])));
    expect(rowsOf(write)).toEqual(['..1']);
  });

  test('moves a cel shared by two frames once', () => {
    const engine = pixelEngine(transformArtwork());
    okOf(engine.execute(request([stepOf('pixels.move', scopeOf([transformIds.linked]), { offset: { x: 1, y: 0 } })])));
    expect(celRows(engine.state().artwork, transformIds.linked, transformIds.linkedBody)).toEqual(['.12']);
  });

  test('refuses a locked layer named by id, a bad mask and a missing offset', () => {
    expectLockedInk('pixels.move', { offset: { x: 1, y: 0 } });
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const small = errorOf(engine.execute(request([stepOf('pixels.move', scope, { offset: { x: 1, y: 0 }, mask: maskFromRows(['#']) })])));
    expect(small.code).toBe('INCOMPATIBLE_TARGETS');
    expect(errorOf(engine.execute(request([stepOf('pixels.move', scope, {})]))).code).toBe('INVALID_OPTION');
    expect(errorOf(engine.execute(request([stepOf('pixels.move', scope, { offset: { x: 1.5, y: 0 } })]))).code).toBe('INVALID_OPTION');
  });

  test('preview equals commit', () => {
    expectPreviewEqualsCommit(rowsArtwork(PIXELS), move({ x: 3, y: 1 }));
  });
});
