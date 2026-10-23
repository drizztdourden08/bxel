/* @layer tests @kind test */
import type { TargetScope } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { heartIds, heartProject } from './heart-project';
import { documentId, pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { celRows, errorOf, expectUntouched, okOf } from './result-checks';

const BOTH = [heartIds.heart, heartIds.heartB];
const BODY: TargetScope['layers'] = { by: 'names', names: ['Body'] };
const MARK = { x: 2, y: 2, width: 2, height: 1 };

const markStep = (index = 6) =>
  stepOf(
    'pixels.paint',
    { sprites: BOTH, layers: BODY, frames: { by: 'range', from: 0, to: 0 } },
    { index, points: [{ x: 2, y: 2 }, { x: 3, y: 2 }], brush: { shape: 'square', size: 1 }, pixelPerfect: false },
  );

describe('pixels.paint on the heart pair', () => {
  test('paints both hearts by layer name in one revision and one history entry', () => {
    const engine = pixelEngine(heartProject());
    const before = engine.state().project;
    const result = okOf(engine.execute(request([markStep()], { origin: 'mcp', label: 'Mark both hearts' })));
    expect(result.baseRevision).toBe(1);
    expect(result.revision).toBe(2);
    expect(result.changes.sprites.map((sprite) => sprite.id)).toEqual(BOTH);
    expect(result.changes.sprites.flatMap((sprite) => sprite.cels.map((cel) => cel.rect))).toEqual([MARK, MARK]);
    const after = engine.state().project;
    expect(celRows(after, heartIds.heart, heartIds.cel)[2]).toBe('13663341');
    expect(celRows(after, heartIds.heartB, heartIds.celB)[2]).toBe('15665541');
    expect(after.sprites[1]?.layers[1]).toEqual(before.sprites[1]?.layers[1]);
    expect(Object.keys(after.sprites[1]?.cels ?? {})).toEqual(['cel_000024']);
    expect(okOf(engine.undo({ documentId, expectedRevision: 2 })).revision).toBe(3);
    expect(engine.canUndo()).toBe(false);
  });

  test('rejects a stale base revision without touching the document', () => {
    const engine = pixelEngine(heartProject());
    const before = engine.state().project;
    const error = errorOf(engine.execute(request([markStep()], { baseRevision: 0 })));
    expect(error.code).toBe('STALE_REVISION');
    expectUntouched(engine, before);
  });

  test('fails on the locked Ink layer when it is named by id', () => {
    const engine = pixelEngine(heartProject());
    const before = engine.state().project;
    const scope = scopeOf([heartIds.heartB], { by: 'ids', ids: [heartIds.ink] });
    const options = { index: 1, points: [{ x: 1, y: 1 }] };
    const error = errorOf(engine.execute(request([stepOf('pixels.paint', scope, options)])));
    expect(error.code).toBe('LAYER_LOCKED');
    expect(error.step).toBe(0);
    expect(error.details.map((issue) => issue.layerId)).toEqual([heartIds.ink]);
    expectUntouched(engine, before);
  });

  test('skips the locked Ink layer with a warning when it is reached through all', () => {
    const engine = pixelEngine(heartProject());
    const scope = scopeOf([heartIds.heartB]);
    const result = okOf(engine.execute(request([stepOf('pixels.paint', scope, { index: 1, points: [{ x: 0, y: 0 }] })])));
    expect(result.warnings.map((warning) => [warning.code, warning.step])).toEqual([['LAYER_LOCKED', 0]]);
    expect(celRows(engine.state().project, heartIds.heartB, heartIds.celB)[0]).toBe('11100110');
  });

  test('fails with a target error when no editable cel matches', () => {
    const engine = pixelEngine(heartProject());
    const none = (sprites: TargetScope['sprites']) => {
      const scope: TargetScope = { sprites, layers: { by: 'names', names: ['Ink'] }, frames: { by: 'all' } };
      const options = { index: 1, points: [{ x: 0, y: 0 }] };
      return errorOf(engine.execute(request([stepOf('pixels.paint', scope, options)])));
    };
    expect(none([heartIds.heartB]).code).toBe('TARGET_EMPTY');
    const many = none(BOTH);
    expect(many.code).toBe('INCOMPATIBLE_TARGETS');
    expect(many.details.map((issue) => issue.spriteId)).toEqual(BOTH);
  });
});

describe('pixels.paint rejections', () => {
  test('refuses an index at the palette size and lists every target sprite', () => {
    const engine = pixelEngine(heartProject());
    const before = engine.state().project;
    const error = errorOf(engine.execute(request([markStep(7)])));
    expect(error.code).toBe('INDEX_OUT_OF_RANGE');
    expect(error.details.map((issue) => issue.spriteId)).toEqual(BOTH);
    expectUntouched(engine, before);
  });

  test('applies nothing when a later step fails', () => {
    const engine = pixelEngine(heartProject());
    const before = engine.state().project;
    const result = engine.execute(request([markStep(), markStep(9)]));
    expect(errorOf(result).step).toBe(1);
    expectUntouched(engine, before);
  });
});
