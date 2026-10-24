/* @layer core @kind test */
import { sliceAsset } from '@bxel/document';
import type { Engine } from '@bxel/document';
import { decodeSprite } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { encodeSlice } from './asset-bytes';
import { heartEngine } from './heart-engine';
import { apply, expectUndoRedo, HEART, onSprites, plain, rejection } from './sheet-engine';

const sprite = (engine: Engine) => engine.state().artwork.sprites.find((each) => each.id === HEART);

const update = (options: unknown) => onSprites('sprite.update', options, [HEART]);

describe('the pixel grid of one sprite', () => {
  it('is unset until a sprite takes one, and sprite.update sets, keeps and clears it in one undo step each', () => {
    const { engine } = heartEngine();
    expect(sprite(engine)?.pixelGrid).toBeUndefined();
    expectUndoRedo(engine, update({ pixelGrid: { width: 8, height: 4 } }));
    apply(engine, update({ pixelGrid: { width: 8, height: 4 } }));
    expect(sprite(engine)?.pixelGrid).toEqual({ width: 8, height: 4 });
    const kept = sprite(engine)?.pixelGrid;
    apply(engine, update({ name: 'renamed', pixelGrid: { width: 8, height: 4 } }));
    expect(sprite(engine)?.pixelGrid).toBe(kept);
    apply(engine, update({ pixelGrid: null }));
    expect(sprite(engine)?.pixelGrid).toBeUndefined();
  });

  it('is given to a new sprite by sprite.create', () => {
    const { engine } = heartEngine();
    apply(engine, plain('sprite.create', { name: 'tile', width: 16, height: 16, pixelGrid: { width: 16, height: 16 } }));
    const made = engine.state().artwork.sprites.find((each) => each.name === 'tile');
    expect(made?.pixelGrid).toEqual({ width: 16, height: 16 });
  });

  it('refuses a cell that is not a whole number of pixels', () => {
    const { engine } = heartEngine();
    expect(rejection(engine, update({ pixelGrid: { width: 0, height: 4 } })).code).toBeTruthy();
    expect(rejection(engine, update({ pixelGrid: { width: 2.5, height: 4 } })).code).toBeTruthy();
  });

  it('is saved with the sprite, read back, and absent from a file that never had one', () => {
    const { engine } = heartEngine();
    const bare = sliceAsset(engine.state().artwork, { kind: 'sprite', id: HEART }, new Map());
    expect(decodeSprite(encodeSlice(bare)).slice?.artwork.sprites?.find((each) => each.id === HEART)?.pixelGrid).toBeUndefined();
    apply(engine, update({ pixelGrid: { width: 4, height: 4 } }));
    const slice = sliceAsset(engine.state().artwork, { kind: 'sprite', id: HEART }, new Map());
    const found = decodeSprite(encodeSlice(slice)).slice?.artwork.sprites?.find((each) => each.id === HEART);
    expect(found?.pixelGrid).toEqual({ width: 4, height: 4 });
  });
});
