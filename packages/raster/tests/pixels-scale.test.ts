/* @layer tests @kind test */
import { findSprite } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { celRows, errorOf, expectLockedInk, expectOneUndo, expectPreviewEqualsCommit, expectUntouched, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { heartIds, heartProject } from './heart-project';
import { emptyProject, rowsIds, rowsProject } from './rows-project';
import { dimsOf } from './transform-checks';

const BLOCK = ['......', '.12...', '.34...', '......', '......', '......'];
const BLOCK_MASK = maskFromRows(['......', '.##...', '.##...', '......', '......', '......']);
const scope = scopeOf([rowsIds.sprite]);
const factor = (value: number) => ({ by: 'factor', x: value, y: value });
const scale = (extra: Record<string, unknown>) => stepOf('pixels.scale', scope, { target: factor(2), ...extra });
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().project, rowsIds.sprite, rowsIds.cel);

describe('pixels.scale', () => {
  test('scales a masked region by an integer factor as one undo step', () => {
    const engine = pixelEngine(rowsProject(BLOCK));
    const original = engine.state().project;
    const result = okOf(engine.execute(request([scale({ mask: BLOCK_MASK })])));
    expect(rowsOf(engine)).toEqual(['......', '.1122.', '.1122.', '.3344.', '.3344.', '......']);
    expect(result.warnings).toEqual([]);
    expectOneUndo(engine, original);
  });

  test('scales to an arbitrary size about an anchor', () => {
    const engine = pixelEngine(rowsProject(BLOCK));
    const target = { by: 'size', width: 3, height: 1 };
    okOf(engine.execute(request([scale({ mask: BLOCK_MASK, target })])));
    expect(rowsOf(engine)).toEqual(['......', '.344..', '......', '......', '......', '......']);
    const centered = pixelEngine(rowsProject(BLOCK));
    okOf(centered.execute(request([scale({ mask: BLOCK_MASK, target: { by: 'size', width: 4, height: 4 }, anchor: 'center' })])));
    expect(rowsOf(centered)).toEqual(['1122..', '1122..', '3344..', '3344..', '......', '......']);
  });

  test('expand grows the sprite, its pivot and every cel', () => {
    const engine = pixelEngine(rowsProject(['12', '34']));
    const original = engine.state().project;
    const result = okOf(engine.execute(request([scale({ bounds: 'expand' })])));
    expect(dimsOf(engine, rowsIds.sprite)).toEqual({ width: 4, height: 4, pivot: { x2: 2, y2: 2 } });
    expect(rowsOf(engine)).toEqual(['1122', '1122', '3344', '3344']);
    expect(result.warnings).toEqual([]);
    expectOneUndo(engine, original);
  });

  test('expand with an anchor on the far corner pads the near side and moves the pivot', () => {
    const engine = pixelEngine(rowsProject(['12', '34']));
    const original = engine.state().project;
    okOf(engine.execute(request([scale({ bounds: 'expand', anchor: 'bottom-right' })])));
    expect(dimsOf(engine, rowsIds.sprite)).toEqual({ width: 4, height: 4, pivot: { x2: 6, y2: 6 } });
    expect(rowsOf(engine)).toEqual(['1122', '1122', '3344', '3344']);
    expectOneUndo(engine, original);
  });

});

describe('pixels.scale on several sprites', () => {
  test('expand pads the layers it does not paint', () => {
    const engine = pixelEngine(heartProject());
    const original = engine.state().project;
    const names = scopeOf([heartIds.heart, heartIds.heartB], { by: 'names', names: ['Body'] });
    okOf(engine.execute(request([stepOf('pixels.scale', names, { target: factor(2), bounds: 'expand' })])));
    for (const id of [heartIds.heart, heartIds.heartB]) {
      expect(dimsOf(engine, id)).toMatchObject({ width: 16, height: 16 });
    }
    expect(findSprite(engine.state().project, heartIds.heartB)?.layers).toHaveLength(2);
    expect(celRows(engine.state().project, heartIds.heart, heartIds.cel)[0]).toBe('..1111....1111..');
    expectOneUndo(engine, original);
  });

});

describe('pixels.scale bounds and guards', () => {
  test('crop drops what leaves the sprite and says how many pixels', () => {
    const engine = pixelEngine(rowsProject(['12', '34']));
    const result = okOf(engine.execute(request([scale({ bounds: 'crop' })])));
    expect(rowsOf(engine)).toEqual(['11', '11']);
    expect(result.warnings).toEqual([
      { code: 'PIXELS_CLIPPED', step: 0, message: '12 masked pixel(s) moved outside the sprite and were dropped.' },
    ]);
  });

  test('cancel refuses a result that leaves the sprite and writes nothing', () => {
    const engine = pixelEngine(rowsProject(['12', '34']));
    const before = engine.state().project;
    const error = errorOf(engine.execute(request([scale({ bounds: 'cancel' })])));
    expect(error.code).toBe('OUT_OF_BOUNDS');
    expect(error.details[0]?.spriteId).toBe(rowsIds.sprite);
    expectUntouched(engine, before);
    okOf(engine.execute(request([scale({ bounds: 'cancel', mask: maskFromRows(['#.', '..']), target: factor(1) })])));
  });

  test('refuses a result wider than a sprite can be', () => {
    const engine = pixelEngine(emptyProject(40, 40));
    const error = errorOf(engine.execute(request([scale({ target: factor(64), bounds: 'expand' })])));
    expect(error.code).toBe('SIZE_OUT_OF_RANGE');
  });

  test('refuses a locked layer by id, bad targets and a mask of another size', () => {
    expectLockedInk('pixels.scale', { target: factor(2) });
    const engine = pixelEngine(rowsProject(BLOCK));
    for (const bad of [{ target: { by: 'factor', x: 0, y: 1 } }, { target: { by: 'size', width: 3 } }, { target: factor(2), bounds: 'wrap' }, {}]) {
      expect(errorOf(engine.execute(request([stepOf('pixels.scale', scope, bad)]))).code).toBe('INVALID_OPTION');
    }
    const small = errorOf(engine.execute(request([scale({ mask: maskFromRows(['#']) })])));
    expect(small.code).toBe('INCOMPATIBLE_TARGETS');
  });

  test('preview equals commit, also when the sprite grows', () => {
    expectPreviewEqualsCommit(rowsProject(BLOCK), scale({ mask: BLOCK_MASK }));
    expectPreviewEqualsCommit(rowsProject(['12', '34']), scale({ bounds: 'expand', anchor: 'bottom-right' }));
  });
});
