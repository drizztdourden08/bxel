/* @layer tests @kind test */
import { findSprite } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { celRows, errorOf, expectLockedInk, expectOneUndo, expectPreviewEqualsCommit, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { heartIds, heartArtwork } from './heart-artwork';
import { emptyArtwork, rowsIds, rowsArtwork } from './rows-artwork';
import { transformIds, transformArtwork } from './transform-artwork';

const ROWS = ['1122', '2211', '3333'];
const scope = scopeOf([rowsIds.sprite]);
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel);

describe('pixels.replace', () => {
  test('swaps one index for another and reports the count as one undo step', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([stepOf('pixels.replace', scope, { from: 2, to: 5 })])));
    expect(rowsOf(engine)).toEqual(['1155', '5511', '3333']);
    expect(result.warnings).toEqual([]);
    expect(result.report).toEqual({ pixelsReplaced: 4 });
    expect(result.changes.sprites[0]?.cels[0]?.rect).toEqual({ x: 0, y: 0, width: 4, height: 2 });
    expectOneUndo(engine, original);
  });

  test('stays inside the mask', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    const mask = maskFromRows(['..##', '....', '....']);
    const result = okOf(engine.execute(request([stepOf('pixels.replace', scope, { from: 2, to: 5, mask })])));
    expect(rowsOf(engine)).toEqual(['1155', '2211', '3333']);
    expect(result.report.pixelsReplaced).toBe(2);
  });

  test('the same index in and out is a no-op', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    const result = okOf(engine.execute(request([stepOf('pixels.replace', scope, { from: 2, to: 2 })])));
    expect(result.noop).toBe(true);
    expect(engine.state().revision).toBe(1);
  });

  test('replaces in every frame and counts a linked cel once', () => {
    const engine = pixelEngine(transformArtwork());
    const result = okOf(engine.execute(request([stepOf('pixels.replace', scopeOf([transformIds.linked]), { from: 1, to: 4 })])));
    expect(celRows(engine.state().artwork, transformIds.linked, transformIds.linkedBody)).toEqual(['423']);
    expect(result.report.pixelsReplaced).toBe(1);
  });

  test('skips a locked and a hidden layer reached by name or all', () => {
    const engine = pixelEngine(transformArtwork());
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([stepOf('pixels.replace', scopeOf([transformIds.guarded]), { from: 5, to: 1 })])));
    expect(result.report.pixelsReplaced).toBe(0);
    expect(result.report.pixelsReplaced).toBeGreaterThanOrEqual(0);
    expect(engine.state().artwork).toEqual(original);
    expect(result.noop).toBe(true);
  });

});

describe('pixels.replace guards', () => {
  test('refuses a locked layer named by id', () => {
    expectLockedInk('pixels.replace', { from: 1, to: 2 });
  });

  test('refuses an index at the palette size and a mask of another size', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    expect(errorOf(engine.execute(request([stepOf('pixels.replace', scope, { from: 1, to: 7 })]))).code).toBe('INDEX_OUT_OF_RANGE');
    const small = maskFromRows(['#']);
    expect(errorOf(engine.execute(request([stepOf('pixels.replace', scope, { from: 1, to: 2, mask: small })]))).code).toBe('INCOMPATIBLE_TARGETS');
    expect(errorOf(engine.execute(request([stepOf('pixels.replace', scope, { from: -1, to: 2 })]))).code).toBe('INVALID_OPTION');
    expect(engine.state().revision).toBe(1);
  });

  test('replaces on several sprites at once', () => {
    const engine = pixelEngine(heartArtwork());
    const original = engine.state().artwork;
    const steps = [stepOf('pixels.replace', scopeOf([heartIds.heart, heartIds.heartB], { by: 'names', names: ['Body'] }), { from: 3, to: 6 })];
    const result = okOf(engine.execute(request(steps)));
    expect(result.changes.sprites).toHaveLength(1);
    expect(findSprite(engine.state().artwork, heartIds.heartB)).toEqual(findSprite(original, heartIds.heartB));
    expect(result.report.pixelsReplaced).toBe(22);
    expectOneUndo(engine, original);
  });

  test('preview equals commit', () => {
    expectPreviewEqualsCommit(rowsArtwork(ROWS), stepOf('pixels.replace', scope, { from: 2, to: 5 }));
  });
});

describe('pixels.clear', () => {
  test('clears the masked pixels as one undo step', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    const original = engine.state().artwork;
    const mask = maskFromRows(['.##.', '.##.', '....']);
    okOf(engine.execute(request([stepOf('pixels.clear', scope, { mask })])));
    expect(rowsOf(engine)).toEqual(['1..2', '2..1', '3333']);
    expectOneUndo(engine, original);
  });

  test('clears the whole cel without a mask', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    okOf(engine.execute(request([stepOf('pixels.clear', scope, {})])));
    expect(rowsOf(engine)).toEqual(['....', '....', '....']);
  });

  test('clears every frame of a sprite and shares a linked cel once', () => {
    const engine = pixelEngine(transformArtwork());
    const result = okOf(engine.execute(request([stepOf('pixels.clear', scopeOf([transformIds.linked]), {})])));
    expect(celRows(engine.state().artwork, transformIds.linked, transformIds.linkedBody)).toEqual(['...']);
    expect(result.changes.sprites[0]?.cels).toHaveLength(2);
  });

  test('a layer with no cel yet stays without one', () => {
    const engine = pixelEngine(emptyArtwork(4, 2));
    const result = okOf(engine.execute(request([stepOf('pixels.clear', scope, {})])));
    expect(result.noop).toBe(true);
    expect(findSprite(engine.state().artwork, rowsIds.sprite)?.cels).toEqual({});
  });

  test('refuses a locked layer named by id and a mask of another size', () => {
    expectLockedInk('pixels.clear', {});
    const engine = pixelEngine(rowsArtwork(ROWS));
    const error = errorOf(engine.execute(request([stepOf('pixels.clear', scope, { mask: maskFromRows(['#']) })])));
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
  });

  test('preview equals commit', () => {
    expectPreviewEqualsCommit(rowsArtwork(ROWS), stepOf('pixels.clear', scope, { mask: maskFromRows(['##..', '....', '....']) }));
  });
});
