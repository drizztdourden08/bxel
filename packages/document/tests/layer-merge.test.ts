/* @layer core @kind test */
import { flattenFrame } from '@bxel/document';
import type { FrameId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { brand } from './fixture-to-project';
import { MUSHROOM, MUSHROOM_B, apply, celPixels, expectUndoRedo, layerEngine, layerNames, layerOf, layerStep, named, rejection, sprite } from './layer-engine';

const FIRST = brand<FrameId>('frm_000110');
const SECOND = brand<FrameId>('frm_000111');
const ONLY = brand<FrameId>('frm_000210');

describe('layer.merge', () => {
  it('merges into the layer below, which keeps its name and id', () => {
    const engine = layerEngine();
    const below = layerOf(engine, 'Shadow');
    expectUndoRedo(engine, layerStep('layer.merge', { layer: named('Body') }));
    expect(layerNames(engine)).toEqual(['Shadow', 'Frozen', 'Paint', 'Ghost', 'Outline']);
    expect(layerOf(engine, 'Shadow').id).toBe(below.id);
  });

  it('draws the merged layer over the lower one and keeps the picture', () => {
    const engine = layerEngine();
    const first = flattenFrame(sprite(engine), FIRST);
    const second = flattenFrame(sprite(engine), SECOND);
    apply(engine, layerStep('layer.merge', { layer: named('Body') }));
    const merged = layerOf(engine, 'Shadow');
    expect(celPixels(engine, merged.cels[FIRST])).toEqual(Uint8Array.from('1220222200000000'.split('').map(Number)));
    expect(merged.cels[SECOND]).toBeDefined();
    expect(flattenFrame(sprite(engine), FIRST)).toEqual(first);
    expect(flattenFrame(sprite(engine), SECOND)).toEqual(second);
  });

  it('drops the cels of the merged layer that nothing else uses', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.merge', { layer: named('Body') }));
    expect(Object.keys(sprite(engine).cels)).not.toContain('cel_000121');
    expect(Object.keys(sprite(engine).cels)).not.toContain('cel_000122');
  });

});

describe('layer.merge rules', () => {
  it('refuses to merge onto a hidden layer', () => {
    const engine = layerEngine();
    const below = layerOf(engine, 'Ghost');
    expect(rejection(engine, layerStep('layer.merge', { layer: named('Outline') })).code).toBe('LAYER_HIDDEN');
    expect(layerOf(engine, 'Ghost')).toBe(below);
  });

  it('fails from the bottom layer', () => {
    const error = rejection(layerEngine(), layerStep('layer.merge', { layer: named('Shadow') }));
    expect(error.code).toBe('NO_LAYER_BELOW');
    expect(error.message).toBe('Cannot merge down from the bottom layer.');
  });

  it('never merges a hidden layer, even with allowLocked', () => {
    const step = layerStep('layer.merge', { layer: named('Ghost'), allowLocked: true });
    expect(rejection(layerEngine(), step).code).toBe('LAYER_HIDDEN');
  });

  it('refuses to merge into a locked layer unless allowLocked is set', () => {
    const engine = layerEngine();
    const error = rejection(engine, layerStep('layer.merge', { layer: named('Paint') }));
    expect(error.code).toBe('LAYER_LOCKED');
    expect(error.details.map((issue) => issue.layerId)).toEqual(['lay_000103']);
    apply(engine, layerStep('layer.merge', { layer: named('Paint'), allowLocked: true }));
    expect(layerNames(engine)).not.toContain('Paint');
    expect(layerOf(engine, 'Frozen').locked).toBe(true);
  });

  it('refuses to merge a locked layer unless allowLocked is set', () => {
    const engine = layerEngine();
    expect(rejection(engine, layerStep('layer.merge', { layer: named('Frozen') })).code).toBe('LAYER_LOCKED');
    apply(engine, layerStep('layer.merge', { layer: named('Frozen'), allowLocked: true }));
    expect(layerNames(engine)).not.toContain('Frozen');
  });

  it('leaves a cel that another layer shares untouched', () => {
    const engine = layerEngine();
    const shared = celPixels(engine, 'cel_000220', MUSHROOM_B)?.slice();
    apply(engine, layerStep('layer.merge', { layer: named('Outline') }, [MUSHROOM_B]));
    expect(celPixels(engine, 'cel_000220', MUSHROOM_B)).toEqual(shared);
    const echo = layerOf(engine, 'Echo', MUSHROOM_B).cels[ONLY];
    expect(echo).not.toBe('cel_000220');
    expect(celPixels(engine, echo, MUSHROOM_B)?.[0]).toBe(1);
    expect(layerOf(engine, 'Body', MUSHROOM_B).cels[ONLY]).toBe('cel_000220');
  });

  it('merges a layer into one that shows the same cel', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.merge', { layer: named('Echo') }, [MUSHROOM_B]));
    expect(layerNames(engine, MUSHROOM_B)).toEqual(['Body', 'Outline']);
    expect(layerOf(engine, 'Body', MUSHROOM_B).cels[ONLY]).toBe('cel_000220');
  });

  it('merges by name in several sprites as one undo step', () => {
    const engine = layerEngine();
    const step = layerStep('layer.merge', { layer: named('Outline') }, [MUSHROOM, MUSHROOM_B]);
    expect(rejection(engine, step).code).toBe('LAYER_HIDDEN');
    apply(engine, layerStep('layer.update', { layer: named('Ghost'), visible: true }));
    expectUndoRedo(engine, step);
    expect(layerNames(engine, MUSHROOM)).toEqual(['Shadow', 'Body', 'Frozen', 'Paint', 'Ghost']);
    expect(layerNames(engine, MUSHROOM_B)).toEqual(['Body', 'Echo']);
  });
});
