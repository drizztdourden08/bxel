/* @layer core @kind test */
import { artworkCreate, counterIdSource } from '@bxel/document';
import { decodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { heartEngine } from './heart-engine';
import { encodeHeart, heartState } from './native-fixture';
import { apply, expectUndoRedo, plain, rejection } from './sheet-engine';

const bank = { name: 'Dusk', cap: 16, transparent: true, colors: [{ rgb: '#140b26' }] };

describe('artwork platform id', () => {
  it('is set when the artwork is created and absent otherwise', () => {
    const made = artworkCreate({ options: { name: 'hero', platformId: 'snes-sprite', bank }, ids: counterIdSource() });
    expect(made.ok && made.state.artwork.platformId).toBe('snes-sprite');
    const plainMade = artworkCreate({ options: { name: 'hero', bank }, ids: counterIdSource() });
    expect(plainMade.ok && 'platformId' in plainMade.state.artwork).toBe(false);
  });

  it('refuses an id that is not a platform id', () => {
    for (const platformId of ['SNES', 'a b', '', '-x', 'x'.repeat(65)]) {
      const result = artworkCreate({ options: { name: 'hero', platformId, bank }, ids: counterIdSource() });
      expect(result.ok).toBe(false);
    }
  });

  it('is set and cleared by artwork.update as one undo step each', () => {
    const { engine } = heartEngine();
    expectUndoRedo(engine, plain('artwork.update', { platformId: 'gb-dmg' }));
    apply(engine, plain('artwork.update', { platformId: 'gb-dmg' }));
    expect(engine.state().artwork.platformId).toBe('gb-dmg');
    apply(engine, plain('artwork.update', { name: 'renamed' }));
    expect(engine.state().artwork.platformId).toBe('gb-dmg');
    expectUndoRedo(engine, plain('artwork.update', { platformId: null }));
    apply(engine, plain('artwork.update', { platformId: null }));
    expect(engine.state().artwork.platformId).toBeUndefined();
    expect(rejection(engine, plain('artwork.update', { platformId: 'Bad Id' })).code).toBeTruthy();
  });

});

describe('artwork platform strict switch', () => {
  it('keeps the strict switch with the platform, off by default, one undo step each', () => {
    const { engine } = heartEngine();
    expect(engine.state().artwork.platformStrict).toBeUndefined();
    apply(engine, plain('artwork.update', { platformStrict: true }));
    expect(engine.state().artwork.platformStrict).toBeUndefined();
    apply(engine, plain('artwork.update', { platformId: 'gb-dmg' }));
    expectUndoRedo(engine, plain('artwork.update', { platformStrict: true }));
    apply(engine, plain('artwork.update', { platformStrict: true }));
    expect(engine.state().artwork.platformStrict).toBe(true);
    apply(engine, plain('artwork.update', { name: 'renamed' }));
    expect(engine.state().artwork.platformStrict).toBe(true);
    apply(engine, plain('artwork.update', { platformStrict: false }));
    expect(engine.state().artwork.platformStrict).toBeUndefined();
    apply(engine, plain('artwork.update', { platformStrict: true }));
    apply(engine, plain('artwork.update', { platformId: null }));
    expect(engine.state().artwork.platformStrict).toBeUndefined();
    expect(rejection(engine, plain('artwork.update', { platformStrict: 'yes' })).code).toBeTruthy();
  });

  it('saves the strict switch and reads a file without it as off', () => {
    const { engine } = heartEngine();
    apply(engine, plain('artwork.update', { platformId: 'nes-sprite', platformStrict: true }));
    const saved = decodeArtwork(encodeHeart(engine.state()));
    expect(saved.artwork?.platformStrict).toBe(true);
    const old = decodeArtwork(encodeHeart(heartState()));
    expect(old.artwork && 'platformStrict' in old.artwork).toBe(false);
  });

});

describe('artwork platform id in a file', () => {
  it('survives a save and a load, and an old file reads without it', () => {
    const { engine } = heartEngine();
    apply(engine, plain('artwork.update', { platformId: 'nes-sprite' }));
    const saved = decodeArtwork(encodeHeart(engine.state()));
    expect(saved.artwork?.platformId).toBe('nes-sprite');
    const old = decodeArtwork(encodeHeart(heartState()));
    expect(old.outcome).toBe('ok');
    expect(old.artwork && 'platformId' in old.artwork).toBe(false);
  });
});
