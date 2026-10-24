/* @layer core @kind test */
import { sliceAsset } from '@bxel/document';
import { decodeSprite } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { heartEngine } from './heart-engine';
import { encodeSlice } from './asset-bytes';
import { apply, expectUndoRedo, HEART, onSprites, plain, rejection } from './sheet-engine';

const sprite = (engine: ReturnType<typeof heartEngine>['engine']) => engine.state().artwork.sprites.find((each) => each.id === HEART);

const update = (options: unknown) => onSprites('sprite.update', options, [HEART]);

describe('the platform of one sprite', () => {
  it('is set and cleared by sprite.update as one undo step each', () => {
    const { engine } = heartEngine();
    expect(sprite(engine)?.platformId).toBeUndefined();
    expectUndoRedo(engine, update({ platformId: 'gb-dmg' }));
    apply(engine, update({ platformId: 'gb-dmg' }));
    expect(sprite(engine)?.platformId).toBe('gb-dmg');
    apply(engine, update({ name: 'renamed' }));
    expect(sprite(engine)?.platformId).toBe('gb-dmg');
    apply(engine, update({ platformId: null }));
    expect(sprite(engine)?.platformId).toBeUndefined();
  });

  it('keeps its own strict switch, which a cleared platform takes away', () => {
    const { engine } = heartEngine();
    apply(engine, update({ platformId: 'nes-sprite', platformStrict: true }));
    expect(sprite(engine)).toMatchObject({ platformId: 'nes-sprite', platformStrict: true });
    apply(engine, update({ platformStrict: false }));
    expect(sprite(engine)?.platformStrict).toBe(false);
    apply(engine, update({ platformStrict: true }));
    apply(engine, update({ platformId: null }));
    expect(sprite(engine)?.platformId).toBeUndefined();
    expect(sprite(engine)?.platformStrict).toBeUndefined();
  });

  it('refuses an id that is not a platform id', () => {
    const { engine } = heartEngine();
    expect(rejection(engine, update({ platformId: 'Bad Id' })).code).toBeTruthy();
  });

  it('is saved with the sprite and read back', () => {
    const { engine } = heartEngine();
    apply(engine, update({ platformId: 'snes-sprite', platformStrict: true }));
    const slice = sliceAsset(engine.state().artwork, { kind: 'sprite', id: HEART }, new Map());
    const found = decodeSprite(encodeSlice(slice)).slice?.artwork.sprites?.find((each) => each.id === HEART);
    expect(found).toMatchObject({ platformId: 'snes-sprite', platformStrict: true });
  });
});

describe('the default palette of the artwork', () => {
  it('accepts a palette that exists', () => {
    const { engine } = heartEngine();
    const current = engine.state().artwork.defaultBankId;
    apply(engine, plain('artwork.update', { defaultBankId: current, name: 'same palette' }));
    expect(engine.state().artwork.defaultBankId).toBe(current);
  });

  it('refuses a palette that does not exist', () => {
    const { engine } = heartEngine();
    expect(rejection(engine, plain('artwork.update', { defaultBankId: 'bnk_999999' })).code).toBeTruthy();
  });
});
