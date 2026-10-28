/* @layer core @kind test */
import type { CommandStep, FrameId, LayerId } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { brand } from './fixture-to-artwork';
import { MUSHROOM, apply, celPixels, expectUndoRedo, layerEngine, layerOf, layerStep, named, rejection } from './layer-engine';

const FIRST = brand<FrameId>('frm_000110');

const patchStep = (layerId: string, pixels: number[]): CommandStep => ({
  name: 'pixels.patch',
  targets: { sprites: [MUSHROOM], layers: { by: 'ids', ids: [brand<LayerId>(layerId)] }, frames: { by: 'ids', ids: [FIRST] } },
  options: { rect: { x: 0, y: 0, width: pixels.length, height: 1 }, pixels: new Uint8Array(pixels) },
});

describe('layer.update colour tags and the transparency lock', () => {
  it('sets, changes and clears a colour tag in one undo step each', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.update', { layer: named('Body'), colour: '#F0718A' }));
    expect(layerOf(engine, 'Body').colour).toBe('#f0718a');
    apply(engine, layerStep('layer.update', { layer: named('Body'), colour: '#5ab8e0' }));
    expect(layerOf(engine, 'Body').colour).toBe('#5ab8e0');
    apply(engine, layerStep('layer.update', { layer: named('Body'), colour: null }));
    expect(Object.keys(layerOf(engine, 'Body'))).not.toContain('colour');
  });

  it('refuses a colour that is not a hex colour', () => {
    expect(rejection(layerEngine(), layerStep('layer.update', { layer: named('Body'), colour: 'red' })).code).toBe('INVALID_OPTION');
  });

  it('sets and clears the transparency lock, and stores nothing when it is off', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.update', { layer: named('Body'), lockTransparency: true }));
    expect(layerOf(engine, 'Body').lockTransparency).toBe(true);
    apply(engine, layerStep('layer.update', { layer: named('Body'), lockTransparency: false }));
    expect(Object.keys(layerOf(engine, 'Body'))).not.toContain('lockTransparency');
  });

  it('copies the tag and the transparency lock to a duplicate', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.update', { layer: named('Body'), colour: '#a6cf5a', lockTransparency: true }));
    apply(engine, layerStep('layer.duplicate', { layer: named('Body') }));
    expect(layerOf(engine, 'Body copy')).toMatchObject({ colour: '#a6cf5a', lockTransparency: true });
  });
});

describe('saving a layer with a tag and a lock', () => {
  it('keeps the colour tag and the transparency lock through save and reopen', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.update', { layer: named('Body'), colour: '#a78bf5', lockTransparency: true }));
    const report = decodeArtwork(encodeArtwork(engine.state(), null, () => 0));
    const body = report.artwork?.sprites.find((each) => each.id === MUSHROOM)?.layers.find((layer) => layer.name === 'Body');
    expect(body).toMatchObject({ colour: '#a78bf5', lockTransparency: true });
    const plain = report.artwork?.sprites.find((each) => each.id === MUSHROOM)?.layers.find((layer) => layer.name === 'Shadow');
    expect(Object.keys(plain ?? {})).not.toContain('colour');
  });
});

describe('the transparency lock on painting', () => {
  it('paints over painted pixels only, and neither fills empty ones nor erases painted ones', () => {
    const engine = layerEngine();
    const body = layerOf(engine, 'Body');
    const before = Array.from(celPixels(engine, body.cels[FIRST]) ?? []).slice(0, 4);
    apply(engine, layerStep('layer.update', { layer: named('Body'), lockTransparency: true }));
    apply(engine, patchStep(body.id, [6, 6, 6, 6]));
    const painted = Array.from(celPixels(engine, layerOf(engine, 'Body').cels[FIRST]) ?? []).slice(0, 4);
    expect(painted).toEqual(before.map((value) => (value === 0 ? 0 : 6)));
    apply(engine, patchStep(body.id, [0, 0, 0, 0]));
    const erased = Array.from(celPixels(engine, layerOf(engine, 'Body').cels[FIRST]) ?? []).slice(0, 4);
    expect(erased).toEqual(painted);
  });

  it('leaves a layer without the lock free to fill empty pixels', () => {
    const engine = layerEngine();
    const body = layerOf(engine, 'Body');
    apply(engine, patchStep(body.id, [6, 6, 6, 6]));
    expect(Array.from(celPixels(engine, layerOf(engine, 'Body').cels[FIRST]) ?? []).slice(0, 4)).toEqual([6, 6, 6, 6]);
  });
});
