/* @layer tests @kind test */
import { findSprite } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { documentId, pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { errorOf, expectUntouched, okOf } from './result-checks';
import { applyStep, dimsOf, rowsOf, snapshotOf } from './transform-checks';
import { transformIds as ids, transformArtwork } from './transform-artwork';

const turnCw = { direction: 'clockwise' };

describe('sprite.turn results', () => {
  test('turns every layer and frame of several sprites, swapping size and mapping each pivot', () => {
    const engine = pixelEngine(transformArtwork());
    const original = engine.state().artwork;
    const result = applyStep(engine, 'sprite.turn', scopeOf([ids.wide, ids.tall]), turnCw);
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['41', '.2', '53']);
    expect(rowsOf(engine, ids.wide, ids.wideBodyB)).toEqual(['35', '2.', '14']);
    expect(rowsOf(engine, ids.wide, ids.wideInk)).toEqual(['..', '.1', '2.']);
    expect(rowsOf(engine, ids.tall, ids.tallBody)).toEqual(['5531', '.642']);
    expect(dimsOf(engine, ids.wide)).toEqual({ width: 2, height: 3, pivot: { x2: 0, y2: 1 } });
    expect(dimsOf(engine, ids.tall)).toEqual({ width: 4, height: 2, pivot: { x2: 6, y2: 3 } });
    expect(result.changes.sprites.every((change) => change.structure && change.meta)).toBe(true);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
    expect(engine.canUndo()).toBe(false);
    okOf(engine.redo({ documentId, expectedRevision: 3 }));
    expect(dimsOf(engine, ids.tall)).toEqual({ width: 4, height: 2, pivot: { x2: 6, y2: 3 } });
    expect(rowsOf(engine, ids.wide, ids.wideBodyB)).toEqual(['35', '2.', '14']);
    okOf(engine.undo({ documentId, expectedRevision: 4 }));
    expect(engine.state().artwork).toEqual(original);
  });

  test('counter-clockwise and half turns follow the contract table', () => {
    const engine = pixelEngine(transformArtwork());
    applyStep(engine, 'sprite.turn', scopeOf([ids.wide]), { direction: 'counter-clockwise' });
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['35', '2.', '14']);
    expect(dimsOf(engine, ids.wide)).toEqual({ width: 2, height: 3, pivot: { x2: 4, y2: 5 } });
    const half = pixelEngine(transformArtwork());
    applyStep(half, 'sprite.turn', scopeOf([ids.wide]), { direction: 'half' });
    expect(rowsOf(half, ids.wide, ids.wideBody)).toEqual(['5.4', '321']);
    expect(dimsOf(half, ids.wide)).toEqual({ width: 3, height: 2, pivot: { x2: 5, y2: 0 } });
  });

  test('turns the cels of the whole sprite even when a frame has no cel in a layer', () => {
    const engine = pixelEngine(transformArtwork());
    applyStep(engine, 'sprite.turn', scopeOf([ids.wide]), turnCw);
    const sprite = findSprite(engine.state().artwork, ids.wide);
    expect(Object.keys(sprite?.cels ?? {})).toHaveLength(3);
    expect(sprite?.layers[1]?.cels).toEqual({ frm_000032: ids.wideInk });
  });
});

describe('sprite.turn round trip', () => {
  test('a 3 by 2 sprite turned, undone and redone matches bit for bit in pixels, size and pivot', () => {
    const engine = pixelEngine(transformArtwork());
    const original = snapshotOf(engine, ids.wide);
    applyStep(engine, 'sprite.turn', scopeOf([ids.wide]), turnCw);
    const turned = snapshotOf(engine, ids.wide);
    expect(turned).not.toEqual(original);
    expect([turned.width, turned.height]).toEqual([2, 3]);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(snapshotOf(engine, ids.wide)).toEqual(original);
    okOf(engine.redo({ documentId, expectedRevision: 3 }));
    expect(snapshotOf(engine, ids.wide)).toEqual(turned);
    okOf(engine.undo({ documentId, expectedRevision: 4 }));
    expect(snapshotOf(engine, ids.wide)).toEqual(original);
  });
});

describe('sprite.turn history', () => {
  const paint = stepOf('pixels.paint', scopeOf([ids.wide], { by: 'names', names: ['Body'] }), {
    index: 6,
    points: [{ x: 0, y: 0 }],
    brush: { shape: 'square', size: 1 },
  });
  const turn = stepOf('sprite.turn', scopeOf([ids.wide, ids.tall]), turnCw);

  test('four turns in one transaction restore pixels, size and pivot bit for bit', () => {
    const engine = pixelEngine(transformArtwork());
    const original = engine.state().artwork;
    okOf(engine.execute(request([turn, turn, turn, turn])));
    expect(engine.state().artwork).toEqual(original);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
  });

  test('four turns in four transactions undo one at a time', () => {
    const engine = pixelEngine(transformArtwork());
    const states = [engine.state().artwork];
    for (let count = 0; count < 4; count++) {
      okOf(engine.execute(request([turn], { baseRevision: 1 + count })));
      states.push(engine.state().artwork);
    }
    expect(states[4]).toEqual(states[0]);
    for (let undone = 0; undone < 4; undone++) {
      okOf(engine.undo({ documentId, expectedRevision: 5 + undone }));
      expect(engine.state().artwork).toEqual(states[3 - undone]);
    }
  });

  test('a turn followed by a paint in the same transaction undoes exactly', () => {
    const engine = pixelEngine(transformArtwork());
    const original = engine.state().artwork;
    okOf(engine.execute(request([stepOf('sprite.turn', scopeOf([ids.wide]), turnCw), paint])));
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['61', '.2', '53']);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
  });

  test('a paint followed by a turn in the same transaction undoes exactly', () => {
    const engine = pixelEngine(transformArtwork());
    const original = engine.state().artwork;
    okOf(engine.execute(request([paint, stepOf('sprite.turn', scopeOf([ids.wide]), turnCw)])));
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['46', '.2', '53']);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
  });
});

describe('sprite.turn refusals', () => {
  test('refuses a locked or hidden layer reached by all, and lists it', () => {
    const engine = pixelEngine(transformArtwork());
    const before = engine.state().artwork;
    const error = errorOf(engine.execute(request([stepOf('sprite.turn', scopeOf([ids.guarded]), turnCw)])));
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
    expect(error.step).toBe(0);
    expect(error.details.map((detail) => [detail.layerId, detail.reason])).toEqual([
      [ids.guardedLockedLayer, expect.stringContaining('locked')],
      [ids.guardedHiddenLayer, expect.stringContaining('hidden')],
    ]);
    expectUntouched(engine, before);
  });

  test('a locked layer named by id keeps the section 04 error', () => {
    const engine = pixelEngine(transformArtwork());
    const scope = scopeOf([ids.guarded], { by: 'ids', ids: [ids.guardedLockedLayer] });
    expect(errorOf(engine.execute(request([stepOf('sprite.turn', scope, turnCw)]))).code).toBe('LAYER_LOCKED');
  });

  test('refuses a layer or frame scope that leaves cels unturned, and names the sprites', () => {
    const engine = pixelEngine(transformArtwork());
    const before = engine.state().artwork;
    const byLayer = scopeOf([ids.wide, ids.tall], { by: 'names', names: ['Body'] });
    const layers = errorOf(engine.execute(request([stepOf('sprite.turn', byLayer, turnCw)])));
    expect(layers.code).toBe('INCOMPATIBLE_TARGETS');
    expect(layers.details.map((detail) => detail.spriteId)).toEqual([ids.wide]);
    const byFrame = { sprites: [ids.wide], layers: { by: 'all' }, frames: { by: 'range', from: 0, to: 0 } } as const;
    const frames = errorOf(engine.execute(request([stepOf('sprite.turn', byFrame, turnCw)])));
    expect(frames.code).toBe('INCOMPATIBLE_TARGETS');
    expect(frames.details).toHaveLength(2);
    expectUntouched(engine, before);
  });

  test('one failing sprite in a batch leaves the others untouched', () => {
    const engine = pixelEngine(transformArtwork());
    const before = engine.state().artwork;
    const error = errorOf(engine.execute(request([stepOf('sprite.turn', scopeOf([ids.wide, ids.guarded]), turnCw)])));
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
    expectUntouched(engine, before);
  });

  test('rejects an unknown direction', () => {
    const engine = pixelEngine(transformArtwork());
    const step = stepOf('sprite.turn', scopeOf([ids.wide]), { direction: 'left' });
    expect(errorOf(engine.execute(request([step]))).code).toBe('INVALID_OPTION');
  });
});
