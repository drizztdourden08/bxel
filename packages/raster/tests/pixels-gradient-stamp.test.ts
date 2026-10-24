/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { celRows, createdCelRows, errorOf, expectLockedInk, expectOneUndo, expectPreviewEqualsCommit, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { rampProject, withRamps } from './ramp-project';
import { emptyProject, rowsIds } from './rows-project';

const scope = scopeOf([rowsIds.sprite]);
const LINE = { from: { x: 0, y: 0 }, to: { x: 7, y: 0 } };
const gradient = (extra: Record<string, unknown> = {}) => stepOf('pixels.gradient', scope, { ramp: 'Violet', line: LINE, ...extra });
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().project, rowsIds.sprite, rowsIds.cel);

describe('pixels.gradient', () => {
  test('fills solid bands from the ramp as one undo step', () => {
    const engine = pixelEngine(rampProject(['5.5.5.5.']));
    const original = engine.state().project;
    okOf(engine.execute(request([gradient({ last: 2 })])));
    expect(rowsOf(engine)).toEqual(['11122333']);
    expectOneUndo(engine, original);
  });

  test('uses the whole ramp by default and can run it backwards', () => {
    const whole = pixelEngine(rampProject(['........']));
    okOf(whole.execute(request([gradient()])));
    expect(rowsOf(whole)).toEqual(['11223344']);
    const reversed = pixelEngine(rampProject(['........']));
    okOf(reversed.execute(request([gradient({ first: 3, last: 1 })])));
    expect(rowsOf(reversed)).toEqual(['44433222']);
  });

  test('dithers with a Bayer matrix and a pattern origin', () => {
    const engine = pixelEngine(rampProject(['........']));
    okOf(engine.execute(request([gradient({ last: 1, mode: 'dither', dither: 4 })])));
    expect(rowsOf(engine)).toEqual(['11212222']);
    const shifted = pixelEngine(rampProject(['........']));
    okOf(shifted.execute(request([gradient({ last: 1, mode: 'dither', dither: 4, origin: { x: 1, y: 0 } })])));
    expect(rowsOf(shifted)).toEqual(['12121222']);
  });

  test('stays inside a mask', () => {
    const engine = pixelEngine(rampProject(['........']));
    okOf(engine.execute(request([gradient({ last: 2, mask: maskFromRows(['..####..']) })])));
    expect(rowsOf(engine)).toEqual(['..1223..']);
  });

  test('creates the cel of a layer that has none', () => {
    const engine = pixelEngine(withRamps(emptyProject(8, 1)));
    okOf(engine.execute(request([gradient({ last: 2 })])));
    expect(createdCelRows(engine.state().project, rowsIds.sprite)).toEqual(['11122333']);
  });

  test('refuses a missing ramp, a ramp that is too short, and a zero length line', () => {
    const engine = pixelEngine(rampProject(['........']));
    expect(errorOf(engine.execute(request([gradient({ ramp: 'Nope' })]))).code).toBe('TARGET_NOT_FOUND');
    const short = errorOf(engine.execute(request([gradient({ last: 9 })])));
    expect(short.code).toBe('INDEX_OUT_OF_RANGE');
    expect(short.details[0]?.spriteId).toBe(rowsIds.sprite);
    const flat = { from: { x: 2, y: 2 }, to: { x: 2, y: 2 } };
    expect(errorOf(engine.execute(request([gradient({ line: flat })]))).path).toBe('steps.0.options.line.to');
    expect(errorOf(engine.execute(request([gradient({ mode: 'dither', dither: 3 })]))).code).toBe('INVALID_OPTION');
    expect(engine.state().revision).toBe(1);
  });

  test('refuses a locked layer named by id', () => {
    expectLockedInk('pixels.gradient', { ramp: 'Violet', line: LINE });
  });

  test('preview equals commit', () => {
    expectPreviewEqualsCommit(rampProject(['........']), gradient({ last: 2, mode: 'dither', dither: 8 }));
  });
});

describe('pixels.stamp', () => {
  const patch = { width: 2, height: 2, pixels: Uint8Array.from([1, 2, 0, 3]) };
  const stamp = (extra: Record<string, unknown> = {}) =>
    stepOf('pixels.stamp', scope, { patch, points: [{ x: 1, y: 1 }, { x: 4, y: 1 }], anchor: { x: 0, y: 0 }, ...extra });

  test('stamps the patch at each point and creates the cel', () => {
    const engine = pixelEngine(emptyProject(6, 3));
    const original = engine.state().project;
    okOf(engine.execute(request([stamp()])));
    expect(createdCelRows(engine.state().project, rowsIds.sprite)).toEqual(['......', '.12.12', '..3..3']);
    expectOneUndo(engine, original);
  });

  test('skipZero is on by default and off writes the empty pixels too', () => {
    const kept = pixelEngine(withRamps(emptyProject(3, 2)));
    const base = stepOf('pixels.fill', scope, { x: 0, y: 0, index: 5 });
    okOf(kept.execute(request([base, stamp({ points: [{ x: 0, y: 0 }] })])));
    expect(createdCelRows(kept.state().project, rowsIds.sprite)).toEqual(['125', '535']);
    const written = pixelEngine(withRamps(emptyProject(3, 2)));
    okOf(written.execute(request([base, stamp({ points: [{ x: 0, y: 0 }], skipZero: false })])));
    expect(createdCelRows(written.state().project, rowsIds.sprite)).toEqual(['125', '.35']);
  });

  test('clips at the sprite edge and stays inside a mask', () => {
    const edge = pixelEngine(emptyProject(3, 2));
    okOf(edge.execute(request([stamp({ points: [{ x: 2, y: 1 }] })])));
    expect(createdCelRows(edge.state().project, rowsIds.sprite)).toEqual(['...', '..1']);
    const masked = pixelEngine(emptyProject(3, 2));
    okOf(masked.execute(request([stamp({ points: [{ x: 1, y: 0 }], mask: maskFromRows(['..#', '...']) })])));
    expect(createdCelRows(masked.state().project, rowsIds.sprite)).toEqual(['..2', '...']);
  });

  test('refuses an index past the palette, a short patch and a locked layer', () => {
    const engine = pixelEngine(emptyProject(6, 3));
    const high = { width: 1, height: 1, pixels: Uint8Array.from([9]) };
    expect(errorOf(engine.execute(request([stamp({ patch: high })]))).code).toBe('INDEX_OUT_OF_RANGE');
    const short = { width: 2, height: 2, pixels: Uint8Array.from([1]) };
    expect(errorOf(engine.execute(request([stamp({ patch: short })]))).path).toBe('steps.0.options.patch.pixels');
    expectLockedInk('pixels.stamp', { patch, points: [{ x: 1, y: 1 }] });
  });

  test('preview equals commit', () => {
    expectPreviewEqualsCommit(emptyProject(6, 3), stamp());
  });
});
