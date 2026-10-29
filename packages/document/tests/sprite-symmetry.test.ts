/* @layer core @kind test */
import { sliceAsset } from '@bxel/document';
import type { Engine } from '@bxel/document';
import { decodeSprite } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { encodeSlice } from './asset-bytes';
import { heartEngine } from './heart-engine';
import { apply, expectUndoRedo, HEART, onSprites, rejection } from './sheet-engine';

const symmetryOf = (engine: Engine) => engine.state().artwork.sprites.find((each) => each.id === HEART)?.symmetry;

const run = (options: unknown) => onSprites('sprite.symmetry', options, [HEART]);

describe('sprite symmetry', () => {
  it('is absent until set, merges the fields given and is one undo step each time', () => {
    const { engine } = heartEngine();
    expect(symmetryOf(engine)).toBeUndefined();
    expectUndoRedo(engine, run({ x: true, axisX: 8 }));
    apply(engine, run({ y: true }));
    expect(symmetryOf(engine)).toEqual({ x: true, y: true, axisX: 8, axisY: null, diagonal: false, turn: false });
    expectUndoRedo(engine, run({ diagonal: true, axisX: null }));
    expect(symmetryOf(engine)).toMatchObject({ diagonal: true, axisX: null });
  });

  it('drops the field again when every part is back to its default', () => {
    const { engine } = heartEngine();
    apply(engine, run({ x: true }));
    apply(engine, run({ x: false }));
    expect(symmetryOf(engine)).toBeUndefined();
  });

  it('refuses an unknown field and an axis that is not a whole number', () => {
    const { engine } = heartEngine();
    expect(rejection(engine, run({ mirror: true })).code).toBeTruthy();
    expect(rejection(engine, run({ axisX: 1.5 })).code).toBeTruthy();
  });

  it('is saved with the sprite and read back, and absent from a file that never had one', () => {
    const { engine } = heartEngine();
    const bare = sliceAsset(engine.state().artwork, { kind: 'sprite', id: HEART }, new Map());
    expect(decodeSprite(encodeSlice(bare)).slice?.artwork.sprites?.find((each) => each.id === HEART)?.symmetry).toBeUndefined();
    apply(engine, run({ x: true, axisX: 6, turn: true }));
    const slice = sliceAsset(engine.state().artwork, { kind: 'sprite', id: HEART }, new Map());
    const found = decodeSprite(encodeSlice(slice)).slice?.artwork.sprites?.find((each) => each.id === HEART);
    expect(found?.symmetry).toEqual({ x: true, y: false, axisX: 6, axisY: null, diagonal: false, turn: true });
  });
});
