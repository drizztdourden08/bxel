/* @layer tests @kind test */
import { findSprite } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { pixelEngine, scopeOf, stepOf } from './pixel-engine';
import { applySteps } from './transform-checks';
import { transformIds as ids, transformArtwork } from './transform-artwork';

const turnCw = { direction: 'clockwise' };

const addSlice = { name: 'hit', rect: { x: 0, y: 0, width: 3, height: 1 }, pivot: { x2: 0, y2: 0 }, center: { x: 1, y: 0, width: 1, height: 1 } };

const scope = scopeOf([ids.wide]);

describe('sprite.turn with slices', () => {
  test('turns the pivot and the center of a slice inside the slice, so slice.update in the same batch still accepts them', () => {
    const engine = pixelEngine(transformArtwork());
    applySteps(engine, [
      stepOf('slice.add', scope, addSlice),
      stepOf('sprite.turn', scope, turnCw),
      stepOf('slice.update', scope, { slice: { by: 'name', name: 'hit' }, pivot: { x2: 2, y2: 6 } }),
    ]);
    const slice = findSprite(engine.state().artwork, ids.wide)?.slices[0];
    expect(slice?.rect).toEqual({ x: 1, y: 0, width: 1, height: 3 });
    expect(slice?.pivot).toEqual({ x2: 2, y2: 6 });
    expect(slice?.center).toEqual({ x: 0, y: 1, width: 1, height: 1 });
  });

  test('a turned slice pivot keeps its place inside the slice', () => {
    const engine = pixelEngine(transformArtwork());
    applySteps(engine, [stepOf('slice.add', scope, addSlice), stepOf('sprite.turn', scope, turnCw)]);
    expect(findSprite(engine.state().artwork, ids.wide)?.slices[0]?.pivot).toEqual({ x2: 2, y2: 0 });
  });

  test('four turns bring the slice back where it was', () => {
    const engine = pixelEngine(transformArtwork());
    const turn = stepOf('sprite.turn', scope, turnCw);
    applySteps(engine, [stepOf('slice.add', scope, addSlice)]);
    const before = findSprite(engine.state().artwork, ids.wide)?.slices[0];
    const second = pixelEngine(transformArtwork());
    applySteps(second, [stepOf('slice.add', scope, addSlice), turn, turn, turn, turn]);
    expect(findSprite(second.state().artwork, ids.wide)?.slices[0]).toEqual(before);
  });
});
