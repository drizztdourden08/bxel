/* @layer core @kind test */
import { flattenFrame } from '@bxel/document';
import type { CommandStep, FrameId, LayerId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { brand } from './fixture-to-project';
import { LONELY, MUSHROOM, MUSHROOM_B, apply, celPixels, expectUndoRedo, layerEngine, layerNames, layerOf, layerStep, named, rejection, sprite } from './layer-engine';

const FIRST = brand<FrameId>('frm_000110');
const SECOND = brand<FrameId>('frm_000111');

describe('layer.duplicate', () => {
  it('copies the layer above the source with fresh cels and equal pixels', () => {
    const engine = layerEngine();
    const source = layerOf(engine, 'Body');
    expectUndoRedo(engine, layerStep('layer.duplicate', { layer: named('Body') }));
    const copy = layerOf(engine, 'Body copy');
    expect(layerNames(engine).slice(0, 4)).toEqual(['Shadow', 'Body', 'Body copy', 'Frozen']);
    expect(copy.id).not.toBe(source.id);
    expect(copy).toMatchObject({ visible: true, locked: false });
    for (const frameId of [FIRST, SECOND]) {
      const copyCel = copy.cels[frameId];
      const sourceCel = source.cels[frameId];
      expect(copyCel).toBeDefined();
      expect(copyCel).not.toBe(sourceCel);
      expect(celPixels(engine, copyCel)).toEqual(celPixels(engine, sourceCel));
    }
  });

  it('copies a locked layer as an unlocked one', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.duplicate', { layer: named('Frozen'), name: 'Thawed' }));
    expect(layerOf(engine, 'Thawed').locked).toBe(false);
    expect(layerOf(engine, 'Frozen').locked).toBe(true);
  });

  it('keeps a copy independent of its source when it is painted', () => {
    const engine = layerEngine();
    const result = apply(engine, layerStep('layer.duplicate', { layer: named('Body') }, [MUSHROOM], 'copy'));
    const patch: CommandStep = {
      name: 'pixels.patch',
      targets: {
        sprites: [MUSHROOM],
        layers: { by: 'ids', ids: [brand<LayerId>(result.created.copy ?? '')] },
        frames: { by: 'ids', ids: [FIRST] },
      },
      options: { rect: { x: 0, y: 0, width: 1, height: 1 }, pixels: new Uint8Array([6]) },
    };
    apply(engine, patch);
    const sourceCel = layerOf(engine, 'Body').cels[FIRST];
    expect(celPixels(engine, sourceCel)?.[0]).toBe(0);
  });

  it('numbers a copy when the copy name is taken', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.duplicate', { layer: named('Body') }));
    apply(engine, layerStep('layer.duplicate', { layer: named('Body') }));
    expect(layerNames(engine)).toContain('Body copy 2');
  });

  it('rejects a taken name and an unknown layer', () => {
    expect(rejection(layerEngine(), layerStep('layer.duplicate', { layer: named('Body'), name: 'shadow' })).code).toBe('NAME_TAKEN');
    expect(rejection(layerEngine(), layerStep('layer.duplicate', { layer: named('Nope') })).code).toBe('TARGET_NOT_FOUND');
  });

  it('duplicates by name in several sprites', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.duplicate', { layer: named('Outline') }, [MUSHROOM, MUSHROOM_B]));
    expect(layerNames(engine, MUSHROOM_B)).toEqual(['Body', 'Echo', 'Outline', 'Outline copy']);
  });
});

describe('layer.flatten', () => {
  it('adds a top layer holding the visible layers composited, frame by frame', () => {
    const engine = layerEngine();
    const first = flattenFrame(sprite(engine), FIRST);
    const second = flattenFrame(sprite(engine), SECOND);
    expectUndoRedo(engine, layerStep('layer.flatten', {}));
    const flat = layerOf(engine, 'Flattened');
    expect(layerNames(engine).at(-1)).toBe('Flattened');
    expect(celPixels(engine, flat.cels[FIRST])).toEqual(first);
    expect(celPixels(engine, flat.cels[SECOND])).toEqual(second);
    expect(first.includes(5)).toBe(false);
  });

  it('leaves a frame without pixels empty', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.flatten', { name: 'Copy' }, [MUSHROOM_B]));
    expect(Object.keys(layerOf(engine, 'Copy', MUSHROOM_B).cels)).toEqual(['frm_000210']);
    apply(engine, layerStep('layer.flatten', {}, [LONELY]));
    expect(layerOf(engine, 'Flattened', LONELY).cels).toEqual({});
  });

  it('does not change what the sprite looks like', () => {
    const engine = layerEngine();
    const before = flattenFrame(sprite(engine), FIRST);
    apply(engine, layerStep('layer.flatten', {}));
    expect(flattenFrame(sprite(engine), FIRST)).toEqual(before);
  });

  it('rejects a sprite with no visible layer', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.update', { layer: named('Body'), visible: false }, [LONELY]));
    const error = rejection(engine, layerStep('layer.flatten', {}, [LONELY]));
    expect(error.code).toBe('TARGET_EMPTY');
  });

  it('rejects a taken name', () => {
    expect(rejection(layerEngine(), layerStep('layer.flatten', { name: 'body' })).code).toBe('NAME_TAKEN');
  });
});
