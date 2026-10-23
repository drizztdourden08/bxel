/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { expectLockedInk } from './expect-locked-ink';
import { pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { celRows, errorOf, expectUntouched, okOf } from './result-checks';
import { emptyProject, rowsIds, rowsProject } from './rows-project';

const erase = (options: Record<string, unknown>) =>
  request([stepOf('pixels.erase', scopeOf([rowsIds.sprite]), options)]);

describe('pixels.erase', () => {
  test('writes index 0 along the stroke', () => {
    const engine = pixelEngine(rowsProject(['1111', '1111', '1111']));
    okOf(engine.execute(erase({ points: [{ x: 1, y: 1 }, { x: 2, y: 1 }] })));
    expect(celRows(engine.state().project, rowsIds.sprite, rowsIds.cel)).toEqual(['1111', '1..1', '1111']);
  });

  test('erases with a square brush and keeps the clipped part inside the sprite', () => {
    const engine = pixelEngine(rowsProject(['111', '111', '111']));
    okOf(engine.execute(erase({ points: [{ x: 0, y: 0 }], brush: { shape: 'square', size: 3 } })));
    expect(celRows(engine.state().project, rowsIds.sprite, rowsIds.cel)).toEqual(['..1', '..1', '111']);
  });

  test('is a no-op on a layer with no cel and creates nothing', () => {
    const engine = pixelEngine(emptyProject(4, 4));
    const before = engine.state().project;
    const result = okOf(engine.execute(erase({ points: [{ x: 1, y: 1 }] })));
    expect(result.noop).toBe(true);
    expectUntouched(engine, before);
  });

  test('takes no index', () => {
    const engine = pixelEngine(rowsProject(['11']));
    const error = errorOf(engine.execute(erase({ index: 1, points: [{ x: 0, y: 0 }] })));
    expect(error.code).toBe('INVALID_OPTION');
  });

  test('fails on a locked layer named by id', () => {
    expectLockedInk('pixels.erase', { points: [{ x: 0, y: 0 }] });
  });
});
