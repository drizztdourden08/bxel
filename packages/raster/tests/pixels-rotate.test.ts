/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { celRows, errorOf, expectLockedInk, expectOneUndo, expectPreviewEqualsCommit, expectUntouched, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { rowsIds, rowsProject } from './rows-project';
import { dimsOf } from './transform-checks';

const SQUARE = ['1234', '5612', '3456', '1234'];
const SOLID = ['1111', '1111', '1111', '1111'];
const scope = scopeOf([rowsIds.sprite]);
const rotate = (angle: number, extra: Record<string, unknown> = {}) => stepOf('pixels.rotate', scope, { angle, ...extra });
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().project, rowsIds.sprite, rowsIds.cel);

describe('pixels.rotate at right angles', () => {
  test.each([
    [90, 'clockwise'],
    [180, 'half'],
    [270, 'counter-clockwise'],
    [-90, 'counter-clockwise'],
  ] as const)('%i degrees equals the lossless sprite turn', (angle, direction) => {
    const rotated = pixelEngine(rowsProject(SQUARE));
    okOf(rotated.execute(request([rotate(angle)])));
    const turned = pixelEngine(rowsProject(SQUARE));
    okOf(turned.execute(request([stepOf('sprite.turn', scope, { direction })])));
    expect(rowsOf(rotated)).toEqual(rowsOf(turned));
    expect(dimsOf(rotated, rowsIds.sprite)).toEqual(dimsOf(turned, rowsIds.sprite));
  });

  test('a half turn about the middle of a selection equals pixels.turn', () => {
    const pixels = ['.....', '.123.', '.45..', '.....', '.....', '.....'];
    const mask = maskFromRows(['.....', '.###.', '.##..', '.....', '.....', '.....']);
    const rotated = pixelEngine(rowsProject(pixels));
    okOf(rotated.execute(request([rotate(180, { mask, pivot: { x2: 5, y2: 4 } })])));
    const turned = pixelEngine(rowsProject(pixels));
    okOf(turned.execute(request([stepOf('pixels.turn', scope, { direction: 'half', mask })])));
    expect(rowsOf(rotated)).toEqual(['.....', '..54.', '.321.', '.....', '.....', '.....']);
    expect(rowsOf(rotated)).toEqual(rowsOf(turned));
  });

  test('zero degrees is a no-op', () => {
    const engine = pixelEngine(rowsProject(SQUARE));
    expect(okOf(engine.execute(request([rotate(0)]))).noop).toBe(true);
  });
});

describe('pixels.rotate at other angles', () => {
  test('45 degrees turns a block into a diamond as one undo step', () => {
    const engine = pixelEngine(rowsProject(['.......', '.......', '..111..', '..111..', '..111..', '.......', '.......']));
    const original = engine.state().project;
    const result = okOf(engine.execute(request([rotate(45)])));
    expect(rowsOf(engine)).toEqual(['.......', '...1...', '..111..', '.11111.', '..111..', '...1...', '.......']);
    expect(result.warnings).toEqual([]);
    expectOneUndo(engine, original);
  });

  test('expand grows the sprite to hold the rotated corners', () => {
    const engine = pixelEngine(rowsProject(SOLID));
    const original = engine.state().project;
    const result = okOf(engine.execute(request([rotate(45, { bounds: 'expand' })])));
    expect(dimsOf(engine, rowsIds.sprite)).toEqual({ width: 6, height: 6, pivot: { x2: 6, y2: 6 } });
    expect(rowsOf(engine)).toEqual(['......', '..11..', '.1111.', '.1111.', '..11..', '......']);
    expect(result.warnings).toEqual([]);
    expectOneUndo(engine, original);
  });

  test('crop keeps the canvas and reports what leaves it', () => {
    const engine = pixelEngine(rowsProject(SOLID));
    const result = okOf(engine.execute(request([rotate(90, { pivot: { x2: 0, y2: 0 } })])));
    expect(rowsOf(engine)).toEqual(['....', '....', '....', '....']);
    expect(result.warnings).toEqual([
      { code: 'PIXELS_CLIPPED', step: 0, message: '16 masked pixel(s) moved outside the sprite and were dropped.' },
    ]);
  });

  test('expand follows a pivot outside the sprite and shifts the sprite pivot', () => {
    const engine = pixelEngine(rowsProject(SOLID));
    okOf(engine.execute(request([rotate(90, { pivot: { x2: 0, y2: 0 }, bounds: 'expand' })])));
    expect(dimsOf(engine, rowsIds.sprite)).toEqual({ width: 8, height: 4, pivot: { x2: 12, y2: 4 } });
    expect(rowsOf(engine)).toEqual(['1111....', '1111....', '1111....', '1111....']);
  });

});

describe('pixels.rotate bounds and guards', () => {
  test('cancel refuses a rotation that leaves the sprite and writes nothing', () => {
    const engine = pixelEngine(rowsProject(SOLID));
    const before = engine.state().project;
    const error = errorOf(engine.execute(request([rotate(45, { bounds: 'cancel' })])));
    expect(error.code).toBe('OUT_OF_BOUNDS');
    expect(error.details[0]?.spriteId).toBe(rowsIds.sprite);
    expectUntouched(engine, before);
    okOf(engine.execute(request([rotate(90, { bounds: 'cancel' })])));
  });

  test('skipZero keeps what is under the empty pixels of the rotated region', () => {
    const mask = maskFromRows(['##..']);
    const options = { mask, pivot: { x2: 4, y2: 1 } };
    const keep = pixelEngine(rowsProject(['1.5.']));
    okOf(keep.execute(request([rotate(180, { ...options, skipZero: true })])));
    expect(rowsOf(keep)).toEqual(['..51']);
    const write = pixelEngine(rowsProject(['1.5.']));
    okOf(write.execute(request([rotate(180, options)])));
    expect(rowsOf(write)).toEqual(['...1']);
  });

  test('refuses a locked layer by id and bad options', () => {
    expectLockedInk('pixels.rotate', { angle: 30 });
    const engine = pixelEngine(rowsProject(SQUARE));
    for (const bad of [{ angle: 400 }, { angle: Number.NaN }, { angle: 10, bounds: 'wrap' }, { angle: 10, pivot: { x2: 1 } }, {}]) {
      expect(errorOf(engine.execute(request([stepOf('pixels.rotate', scope, bad)]))).code).toBe('INVALID_OPTION');
    }
    const small = errorOf(engine.execute(request([rotate(10, { mask: maskFromRows(['#']) })])));
    expect(small.code).toBe('INCOMPATIBLE_TARGETS');
  });

  test('preview equals commit for every policy', () => {
    for (const bounds of ['expand', 'crop'] as const) {
      expectPreviewEqualsCommit(rowsProject(SOLID), rotate(37, { bounds }));
    }
  });
});
