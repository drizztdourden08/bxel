/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { documentId, pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { celRows, createdCelRows, errorOf, okOf } from './result-checks';
import { emptyArtwork, rowsArtwork, rowsIds } from './rows-artwork';

const SCOPE = scopeOf([rowsIds.sprite]);

const run = (name: string, options: Record<string, unknown>) => request([stepOf(name, SCOPE, options)]);

describe('wrapped commands', () => {
  test('a wrapped pencil stroke continues from the opposite edge as one undo step', () => {
    const engine = pixelEngine(emptyArtwork(6, 3));
    const points = [{ x: 4, y: 1 }, { x: 7, y: 1 }];
    okOf(engine.execute(run('pixels.paint', { index: 1, points, wrap: { x: true } })));
    expect(createdCelRows(engine.state().artwork, rowsIds.sprite)).toEqual(['......', '11..11', '......']);
    expect(engine.canUndo()).toBe(true);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.canUndo()).toBe(false);
  });

  test('a stroke without wrap is clipped', () => {
    const engine = pixelEngine(emptyArtwork(6, 3));
    okOf(engine.execute(run('pixels.paint', { index: 1, points: [{ x: 4, y: 1 }, { x: 8, y: 1 }] })));
    expect(createdCelRows(engine.state().artwork, rowsIds.sprite)).toEqual(['......', '....11', '......']);
  });

  test('a wrapped eraser removes pixels on the far side', () => {
    const engine = pixelEngine(rowsArtwork(['111111']));
    okOf(engine.execute(run('pixels.erase', { points: [{ x: 5, y: 0 }, { x: 7, y: 0 }], wrap: { x: true } })));
    expect(celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel)).toEqual(['..111.']);
  });

  test('a wrapped line wraps over the bottom edge', () => {
    const engine = pixelEngine(emptyArtwork(3, 4));
    const options = { shape: 'line', from: { x: 1, y: 2 }, to: { x: 1, y: 5 }, index: 2, wrap: { y: true } };
    okOf(engine.execute(run('pixels.shape', options)));
    expect(createdCelRows(engine.state().artwork, rowsIds.sprite)).toEqual(['.2.', '.2.', '.2.', '.2.']);
  });

  test('a wrapped filled rectangle reappears on the opposite side', () => {
    const engine = pixelEngine(emptyArtwork(5, 2));
    const options = { shape: 'rect', filled: true, from: { x: 3, y: 0 }, to: { x: 6, y: 0 }, index: 3, wrap: { x: true } };
    okOf(engine.execute(run('pixels.shape', options)));
    expect(createdCelRows(engine.state().artwork, rowsIds.sprite)).toEqual(['33.33', '.....']);
  });

  test('a wrapped fill spreads across the seam and accepts a seed past the edge', () => {
    const engine = pixelEngine(rowsArtwork(['..1..']));
    okOf(engine.execute(run('pixels.fill', { x: 6, y: 0, index: 2, wrap: { x: true } })));
    expect(celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel)).toEqual(['22122']);
  });

  test('a fill seeded outside the sprite still fails without wrap', () => {
    const engine = pixelEngine(rowsArtwork(['..1..']));
    expect(errorOf(engine.execute(run('pixels.fill', { x: 6, y: 0, index: 2 }))).code).toBe('OUT_OF_BOUNDS');
  });

  test('wrap rejects unknown keys', () => {
    const engine = pixelEngine(emptyArtwork(4, 4));
    const result = engine.execute(run('pixels.paint', { index: 1, points: [{ x: 0, y: 0 }], wrap: { z: true } }));
    expect(errorOf(result).code).toBeDefined();
  });
});
