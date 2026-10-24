/* @layer tests @kind test */
import { drawPath } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { createdCelRows, errorOf, expectLockedInk, expectOneUndo, expectPreviewEqualsCommit, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { blankBuffer } from './blank-buffer';
import { emptyProject, rowsIds } from './rows-project';
import { toRows } from './to-rows';

const TRIANGLE = [{ x: 1, y: 1 }, { x: 7, y: 1 }, { x: 4, y: 5 }];
const BOW = { from: { x: 1, y: 5 }, control: { x: 4, y: 0 }, to: { x: 8, y: 5 } };
const scope = scopeOf([rowsIds.sprite]);
const shape = (options: Record<string, unknown>) => stepOf('pixels.shape', scope, { index: 2, ...options });

describe('pixels.shape polygon, curve and contour', () => {
  test('a polygon outline and fill match the direct rasterizer and undo in one step', () => {
    for (const filled of [false, true]) {
      const engine = pixelEngine(emptyProject(9, 7));
      const original = engine.state().project;
      okOf(engine.execute(request([shape({ shape: 'polygon', points: TRIANGLE, filled })])));
      const target = blankBuffer(9, 7);
      drawPath({ target, index: 2, kind: 'polygon', points: TRIANGLE, filled });
      expect(createdCelRows(engine.state().project, rowsIds.sprite)).toEqual(toRows(target));
      expectOneUndo(engine, original);
    }
  });

  test('a curve runs from its first point to its last', () => {
    const engine = pixelEngine(emptyProject(10, 7));
    okOf(engine.execute(request([shape({ shape: 'curve', ...BOW })])));
    expect(createdCelRows(engine.state().project, rowsIds.sprite)).toEqual([
      '..........',
      '..........',
      '..........',
      '...2222...',
      '..2....2..',
      '.2......2.',
      '..........',
    ]);
  });

  test('a contour closes itself', () => {
    const engine = pixelEngine(emptyProject(9, 7));
    const points = [{ x: 1, y: 1 }, { x: 3, y: 0 }, { x: 6, y: 1 }, { x: 7, y: 4 }, { x: 4, y: 5 }, { x: 2, y: 4 }];
    okOf(engine.execute(request([shape({ shape: 'contour', points, filled: true })])));
    expect(createdCelRows(engine.state().project, rowsIds.sprite)[1]).toBe('.222222..');
  });

  test('the older shapes still take from and to', () => {
    const engine = pixelEngine(emptyProject(8, 6));
    okOf(engine.execute(request([shape({ shape: 'rect', from: { x: 1, y: 1 }, to: { x: 6, y: 4 } })])));
    expect(createdCelRows(engine.state().project, rowsIds.sprite)[1]).toBe('.222222.');
  });

  test('refuses too few points, mixed fields, an unknown shape and too many points', () => {
    const engine = pixelEngine(emptyProject(9, 7));
    const few = errorOf(engine.execute(request([shape({ shape: 'polygon', points: TRIANGLE.slice(0, 2) })])));
    expect(few.code).toBe('INVALID_OPTION');
    expect(few.path).toBe('steps.0.options.points');
    expect(errorOf(engine.execute(request([shape({ shape: 'curve', from: BOW.from, to: BOW.to })]))).code).toBe('INVALID_OPTION');
    expect(errorOf(engine.execute(request([shape({ shape: 'line', points: TRIANGLE })]))).code).toBe('INVALID_OPTION');
    expect(errorOf(engine.execute(request([shape({ shape: 'blob', from: BOW.from, to: BOW.to })]))).path).toBe('steps.0.options.shape');
    const many = Array.from({ length: 8193 }, (_, at) => ({ x: at % 9, y: at % 7 }));
    expect(errorOf(engine.execute(request([shape({ shape: 'contour', points: many })]))).code).toBe('BATCH_TOO_LARGE');
    expect(errorOf(engine.execute(request([shape({ shape: 'polygon', points: TRIANGLE, index: 7 })]))).code).toBe('INDEX_OUT_OF_RANGE');
  });

  test('refuses a locked layer named by id', () => {
    expectLockedInk('pixels.shape', { shape: 'polygon', index: 1, points: TRIANGLE });
    expectLockedInk('pixels.shape', { shape: 'curve', index: 1, ...BOW });
  });

  test('preview equals commit', () => {
    expectPreviewEqualsCommit(emptyProject(10, 7), shape({ shape: 'curve', filled: true, ...BOW }));
    expectPreviewEqualsCommit(emptyProject(9, 7), shape({ shape: 'polygon', points: TRIANGLE, symmetry: { x2: 9 } }));
  });
});
