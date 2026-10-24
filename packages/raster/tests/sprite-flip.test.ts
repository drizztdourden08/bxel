/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { documentId, pixelEngine, scopeOf, stepOf } from './pixel-engine';
import { okOf } from './result-checks';
import { applyStep, applySteps, dimsOf, previewOf, refusalOf, rowsOf } from './transform-checks';
import { transformIds as ids, transformArtwork } from './transform-artwork';

const flipH = { axis: 'horizontal' };

describe('sprite.flip results', () => {
  test('flips every layer and frame of several sprites with per-sprite pivots, in one undo step', () => {
    const engine = pixelEngine(transformArtwork());
    const original = engine.state().artwork;
    const result = applyStep(engine, 'sprite.flip', scopeOf([ids.wide, ids.tall]), flipH);
    expect(result.revision).toBe(2);
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['321', '5.4']);
    expect(rowsOf(engine, ids.wide, ids.wideBodyB)).toEqual(['4.5', '123']);
    expect(rowsOf(engine, ids.wide, ids.wideInk)).toEqual(['.1.', '2..']);
    expect(rowsOf(engine, ids.tall, ids.tallBody)).toEqual(['21', '43', '65', '.5']);
    expect(dimsOf(engine, ids.wide)).toEqual({ width: 3, height: 2, pivot: { x2: 5, y2: 4 } });
    expect(dimsOf(engine, ids.tall)).toEqual({ width: 2, height: 4, pivot: { x2: 1, y2: 2 } });
    expect(result.changes.sprites.map((change) => change.id)).toEqual([ids.wide, ids.tall]);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
    expect(engine.canUndo()).toBe(false);
    expect(okOf(engine.redo({ documentId, expectedRevision: 3 })).revision).toBe(4);
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['321', '5.4']);
    expect(dimsOf(engine, ids.tall).pivot).toEqual({ x2: 1, y2: 2 });
  });

  test('a vertical flip mirrors rows and the pivot height', () => {
    const engine = pixelEngine(transformArtwork());
    applyStep(engine, 'sprite.flip', scopeOf([ids.wide]), { axis: 'vertical' });
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['4.5', '123']);
    expect(dimsOf(engine, ids.wide).pivot).toEqual({ x2: 1, y2: 0 });
  });

  test('two flips in one transaction restore the sprite exactly', () => {
    const engine = pixelEngine(transformArtwork());
    const original = engine.state().artwork;
    const scope = scopeOf([ids.wide, ids.tall]);
    applySteps(engine, [stepOf('sprite.flip', scope, flipH), stepOf('sprite.flip', scope, flipH)]);
    expect(engine.state().artwork).toEqual(original);
  });

  test('a layer scope flips only those cels and leaves the pivot', () => {
    const engine = pixelEngine(transformArtwork());
    applyStep(engine, 'sprite.flip', scopeOf([ids.wide], { by: 'names', names: ['Body'] }), flipH);
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['321', '5.4']);
    expect(rowsOf(engine, ids.wide, ids.wideInk)).toEqual(['.1.', '..2']);
    expect(dimsOf(engine, ids.wide).pivot).toEqual({ x2: 1, y2: 4 });
  });

  test('a cel shared by two frames is flipped once', () => {
    const engine = pixelEngine(transformArtwork());
    applyStep(engine, 'sprite.flip', scopeOf([ids.linked]), flipH);
    expect(rowsOf(engine, ids.linked, ids.linkedBody)).toEqual(['321']);
  });
});

describe('sprite.flip guards', () => {
  test('skips locked and hidden layers reached by name or all, warns, and leaves the pivot', () => {
    const engine = pixelEngine(transformArtwork());
    const result = applyStep(engine, 'sprite.flip', scopeOf([ids.guarded]), flipH);
    expect(result.warnings.map((warning) => warning.code)).toEqual(['LAYER_LOCKED', 'LAYER_HIDDEN']);
    expect(rowsOf(engine, ids.guarded, ids.guardedBody)).toEqual(['21', '43']);
    expect(rowsOf(engine, ids.guarded, ids.guardedLocked)).toEqual(['5.', '.5']);
    expect(rowsOf(engine, ids.guarded, ids.guardedHidden)).toEqual(['.4', '4.']);
    expect(dimsOf(engine, ids.guarded).pivot).toEqual({ x2: 1, y2: 1 });
  });

  test('a locked or hidden layer named by id fails and writes nothing', () => {
    for (const [layer, code] of [[ids.guardedLockedLayer, 'LAYER_LOCKED'], [ids.guardedHiddenLayer, 'LAYER_HIDDEN']] as const) {
      const scope = scopeOf([ids.guarded], { by: 'ids', ids: [layer] });
      expect(refusalOf(pixelEngine(transformArtwork()), stepOf('sprite.flip', scope, flipH)).code).toBe(code);
    }
  });

  test('rejects an unknown axis, extra options and a missing axis', () => {
    const engine = pixelEngine(transformArtwork());
    for (const bad of [{ axis: 'diagonal' }, { axis: 'horizontal', extra: 1 }, {}]) {
      expect(refusalOf(engine, stepOf('sprite.flip', scopeOf([ids.wide]), bad)).code).toBe('INVALID_OPTION');
    }
  });

  test('preview equals commit and changes nothing', () => {
    const engine = pixelEngine(transformArtwork());
    const before = engine.state().artwork;
    const step = stepOf('sprite.flip', scopeOf([ids.wide]), flipH);
    const preview = previewOf(engine, step);
    expect(engine.state().artwork).toBe(before);
    expect(engine.state().revision).toBe(1);
    expect(preview.changes).toEqual(applyStep(pixelEngine(transformArtwork()), 'sprite.flip', scopeOf([ids.wide]), flipH).changes);
  });
});
