/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { maskFromRows } from './mask-from-rows';
import { expectLockedInk } from './expect-locked-ink';
import { pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { createdCelRows, celRows, errorOf, expectUntouched, okOf } from './result-checks';
import { emptyArtwork, rowsIds, rowsArtwork } from './rows-artwork';

const fillRequest = (options: Record<string, unknown>) =>
  request([stepOf('pixels.fill', scopeOf([rowsIds.sprite]), { x: 0, y: 0, index: 2, ...options })]);

const filled = (rows: readonly string[], options: Record<string, unknown>): string[] => {
  const engine = pixelEngine(rowsArtwork(rows));
  okOf(engine.execute(fillRequest(options)));
  return celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel);
};

describe('pixels.fill', () => {
  test('crosses a diagonal gap with connectivity 8 only', () => {
    expect(filled(['.1', '1.'], { connectivity: 4 })).toEqual(['21', '1.']);
    expect(filled(['.1', '1.'], { connectivity: 8 })).toEqual(['21', '12']);
  });

  test('global mode replaces every pixel of the seed index', () => {
    const rows = ['.1.', '1.1', '.1.'];
    expect(filled(rows, { x: 1, y: 1, mode: 'contiguous' })).toEqual(['.1.', '121', '.1.']);
    expect(filled(rows, { x: 1, y: 1, mode: 'global' })).toEqual(['212', '121', '212']);
  });

  test('stops at the mask edge', () => {
    expect(filled(['....'], { index: 3, mask: maskFromRows(['##..']) })).toEqual(['33..']);
  });

  test('fills a layer that has no cel yet and creates it', () => {
    const engine = pixelEngine(emptyArtwork(3, 3));
    const result = okOf(engine.execute(fillRequest({})));
    expect(result.changes.sprites[0]?.cels[0]?.rect).toEqual({ x: 0, y: 0, width: 3, height: 3 });
    expect(createdCelRows(engine.state().artwork, rowsIds.sprite)).toEqual(['222', '222', '222']);
  });

  test('is a no-op when the seed already holds the index', () => {
    const engine = pixelEngine(rowsArtwork(['11', '11']));
    const result = okOf(engine.execute(fillRequest({ index: 1 })));
    expect(result.noop).toBe(true);
    expect(engine.state().revision).toBe(1);
  });
});

describe('pixels.fill rejections', () => {
  test('refuses a seed outside every target sprite', () => {
    const engine = pixelEngine(rowsArtwork(['..', '..']));
    const before = engine.state().artwork;
    const error = errorOf(engine.execute(fillRequest({ x: 2 })));
    expect(error.code).toBe('OUT_OF_BOUNDS');
    expect(error.details.map((issue) => issue.spriteId)).toEqual([rowsIds.sprite]);
    expectUntouched(engine, before);
  });

  test('refuses an index at the palette size', () => {
    const engine = pixelEngine(rowsArtwork(['..']));
    expect(errorOf(engine.execute(fillRequest({ index: 7 }))).code).toBe('INDEX_OUT_OF_RANGE');
  });

  test('fails on a locked layer named by id', () => {
    expectLockedInk('pixels.fill', { x: 0, y: 0, index: 2 });
  });
});
