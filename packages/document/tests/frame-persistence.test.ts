/* @layer core @kind test */
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import type { Engine } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { FRAME, WALKER, byIndex, celAt, frameEngine, named, scopedStep } from './frame-engine';
import { apply, layerStep, sprite } from './layer-engine';
import { artworkOf, fixedClock, heartPreview } from './native-fixture';

const reopen = (engine: Engine) => artworkOf(decodeArtwork(encodeArtwork(engine.state(), heartPreview, fixedClock)));

describe('frames, tags and cels survive a save and reopen', () => {
  it('keeps durations after frame.update, frame.add and frame.reorder', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.update', { frame: byIndex(0), durationMs: 1 }));
    apply(engine, layerStep('frame.update', { frame: byIndex(3), durationMs: 65535 }));
    apply(engine, layerStep('frame.add', { after: byIndex(1), durationMs: 333 }));
    apply(engine, layerStep('frame.reorder', { frame: byIndex(0), to: 4 }));
    const opened = reopen(engine);
    expect(canonicalArtwork(opened)).toBe(canonicalArtwork(engine.state().artwork));
    const walker = opened.sprites.find((item) => item.id === WALKER);
    expect(walker?.frames.map((frame) => frame.durationMs)).toEqual([200, 333, 150, 65535, 1]);
  });

  it('keeps linked cels linked and a saved unlink apart', () => {
    const engine = frameEngine();
    apply(engine, layerStep('cel.link', { from: { layer: named('Body'), frame: byIndex(2) }, to: { layer: named('Fx'), frame: byIndex(3) } }));
    const linked = reopen(engine).sprites.find((item) => item.id === WALKER);
    expect(linked?.layers[0]?.cels[FRAME[0]]).toBe(linked?.layers[0]?.cels[FRAME[1]]);
    expect(linked?.layers[1]?.cels[FRAME[3]]).toBe('cel_000121');
    expect(canonicalArtwork(reopen(engine))).toBe(canonicalArtwork(engine.state().artwork));
    apply(engine, scopedStep('cel.unlink', {}, { layers: { by: 'names', names: ['Body'] }, frames: { by: 'all' } }));
    const apart = reopen(engine);
    expect(canonicalArtwork(apart)).toBe(canonicalArtwork(engine.state().artwork));
    expect(celAt(engine, 'Body', FRAME[0])).not.toBe(celAt(engine, 'Body', FRAME[1]));
  });

  it('keeps tags after a frame delete and a reorder', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.delete', { frame: byIndex(1) }));
    apply(engine, layerStep('frame.reorder', { frame: byIndex(0), to: 2 }));
    apply(engine, layerStep('tag.add', { name: 'later', from: byIndex(0), to: byIndex(1) }));
    const opened = reopen(engine);
    expect(opened.sprites.find((item) => item.id === WALKER)?.tags).toEqual(sprite(engine).tags);
  });
});
