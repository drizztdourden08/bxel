/* @layer core @kind test */
import { sliceAsset } from '@bxel/document';
import type { Engine } from '@bxel/document';
import { decodeSprite } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { encodeSlice } from './asset-bytes';
import { heartEngine } from './heart-engine';
import { apply, expectUndoRedo, HEART, onSprites, rejection } from './sheet-engine';

const guidesOf = (engine: Engine) => engine.state().artwork.sprites.find((each) => each.id === HEART)?.guides;

const run = (name: string, options: unknown) => onSprites(name, options, [HEART]);

describe('guides', () => {
  it('are absent until one is added, and each add, move, remove and clear is one undo step', () => {
    const { engine } = heartEngine();
    expect(guidesOf(engine)).toBeUndefined();
    expectUndoRedo(engine, run('guide.add', { axis: 'x', position: 3 }));
    apply(engine, run('guide.add', { axis: 'x', position: 3 }));
    apply(engine, run('guide.add', { axis: 'x', position: 1.5 }));
    apply(engine, run('guide.add', { axis: 'y', position: 2 }));
    expect(guidesOf(engine)).toEqual({ x: [1.5, 3], y: [2] });
    expectUndoRedo(engine, run('guide.move', { axis: 'x', from: 3, to: 5 }));
    expect(guidesOf(engine)?.x).toEqual([1.5, 5]);
    expectUndoRedo(engine, run('guide.remove', { axis: 'y', position: 2 }));
    expect(guidesOf(engine)).toEqual({ x: [1.5, 5], y: [] });
    expectUndoRedo(engine, run('guide.clear', { axis: 'x' }));
    expect(guidesOf(engine)).toBeUndefined();
  });

  it('keeps a repeated add as a no-op and refuses a bad position', () => {
    const { engine } = heartEngine();
    apply(engine, run('guide.add', { axis: 'x', position: 3 }));
    const kept = guidesOf(engine);
    apply(engine, run('guide.add', { axis: 'x', position: 3 }));
    expect(guidesOf(engine)).toBe(kept);
    expect(rejection(engine, run('guide.add', { axis: 'x', position: 9 })).code).toBe('OUT_OF_BOUNDS');
    expect(rejection(engine, run('guide.add', { axis: 'x', position: 1.3 })).code).toBeTruthy();
    expect(rejection(engine, run('guide.add', { axis: 'x', position: -1 })).code).toBeTruthy();
    expect(rejection(engine, run('guide.move', { axis: 'x', from: 4, to: 5 })).code).toBe('TARGET_NOT_FOUND');
    expect(rejection(engine, run('guide.remove', { axis: 'y', position: 3 })).code).toBe('TARGET_NOT_FOUND');
  });

  it('are saved with the sprite and read back, and absent from a file that never had one', () => {
    const { engine } = heartEngine();
    const bare = sliceAsset(engine.state().artwork, { kind: 'sprite', id: HEART }, new Map());
    expect(decodeSprite(encodeSlice(bare)).slice?.artwork.sprites?.find((each) => each.id === HEART)?.guides).toBeUndefined();
    apply(engine, run('guide.add', { axis: 'x', position: 2.5 }), run('guide.add', { axis: 'y', position: 4 }));
    const slice = sliceAsset(engine.state().artwork, { kind: 'sprite', id: HEART }, new Map());
    const found = decodeSprite(encodeSlice(slice)).slice?.artwork.sprites?.find((each) => each.id === HEART);
    expect(found?.guides).toEqual({ x: [2.5], y: [4] });
  });
});
