/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import {
  LONELY,
  MUSHROOM,
  MUSHROOM_B,
  apply,
  celPixels,
  expectUndoRedo,
  layerEngine,
  layerNames,
  layerOf,
  layerStep,
  named,
  rejection,
  sprite,
} from './layer-engine';

describe('layer.add', () => {
  it('adds a named layer on top as one undo step', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.add', { name: 'Glow' }));
    expect(layerNames(engine).at(-1)).toBe('Glow');
    expect(layerOf(engine, 'Glow')).toMatchObject({ visible: true, locked: false, cels: {} });
  });

  it('names a new layer Layer N and keeps the name free', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.add', {}));
    expect(layerNames(engine).at(-1)).toBe('Layer 7');
    apply(engine, layerStep('layer.add', {}, [LONELY]));
    expect(layerNames(engine, LONELY)).toEqual(['Body', 'Layer 2']);
  });

  it('puts the layer above a named layer and reports its id by ref', () => {
    const engine = layerEngine();
    const result = apply(engine, layerStep('layer.add', { name: 'Mid', above: named('body') }, [MUSHROOM], 'made'));
    expect(layerNames(engine).slice(0, 3)).toEqual(['Shadow', 'Body', 'Mid']);
    expect(result.created.made).toBe(layerOf(engine, 'Mid').id);
  });

  it('adds to several sprites by layer name', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.add', { name: 'Glow', above: named('Body') }, [MUSHROOM, MUSHROOM_B]));
    expect(layerNames(engine, MUSHROOM)[2]).toBe('Glow');
    expect(layerNames(engine, MUSHROOM_B)[1]).toBe('Glow');
  });

  it('rejects a taken name in any letter case and leaves nothing changed', () => {
    expect(rejection(layerEngine(), layerStep('layer.add', { name: 'bODY' })).code).toBe('NAME_TAKEN');
  });

  it('rejects a blank name', () => {
    expect(rejection(layerEngine(), layerStep('layer.add', { name: '   ' })).code).toBe('NAME_INVALID');
  });

  it('lists the sprites that lack the anchor layer', () => {
    const error = rejection(layerEngine(), layerStep('layer.add', { above: named('Frozen') }, [MUSHROOM, MUSHROOM_B]));
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
    expect(error.details.map((issue) => issue.spriteId)).toEqual([MUSHROOM_B]);
  });

  it('refuses one ref for several sprites', () => {
    const error = rejection(layerEngine(), layerStep('layer.add', {}, [MUSHROOM, MUSHROOM_B], 'made'));
    expect(error.code).toBe('INVALID_OPTION');
  });
});

describe('layer.delete', () => {
  it('removes the layer and the cels only it used, and undo restores them', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.delete', { layer: named('Body') }));
    expect(layerNames(engine)).not.toContain('Body');
    expect(Object.keys(sprite(engine).cels)).toEqual(['cel_000120', 'cel_000123', 'cel_000124', 'cel_000125']);
  });

  it('deletes a hidden layer', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.delete', { layer: named('Ghost') }));
    expect(layerNames(engine)).not.toContain('Ghost');
  });

  it('keeps a cel another layer still shows', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.delete', { layer: named('Echo') }, [MUSHROOM_B]));
    expect(celPixels(engine, 'cel_000220', MUSHROOM_B)).toBeDefined();
    expect(layerOf(engine, 'Body', MUSHROOM_B).cels).toEqual({ frm_000210: 'cel_000220' });
  });

  it('keeps at least one layer', () => {
    const error = rejection(layerEngine(), layerStep('layer.delete', { layer: named('Body') }, [LONELY]));
    expect(error.code).toBe('LAST_LAYER');
    expect(error.details).toHaveLength(1);
  });

  it('refuses a locked layer unless allowLocked is set', () => {
    const engine = layerEngine();
    expect(rejection(engine, layerStep('layer.delete', { layer: named('Frozen') })).code).toBe('LAYER_LOCKED');
    apply(engine, layerStep('layer.delete', { layer: named('Frozen'), allowLocked: true }));
    expect(layerNames(engine)).not.toContain('Frozen');
  });

  it('deletes by name from several sprites and fails whole when one lacks it', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.delete', { layer: named('Outline') }, [MUSHROOM, MUSHROOM_B]));
    expect(layerNames(engine, MUSHROOM_B)).toEqual(['Body', 'Echo']);
    const error = rejection(layerEngine(), layerStep('layer.delete', { layer: named('Echo') }, [MUSHROOM, MUSHROOM_B]));
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
  });

  it('reports an unknown layer', () => {
    expect(rejection(layerEngine(), layerStep('layer.delete', { layer: named('Nope') })).code).toBe('TARGET_NOT_FOUND');
  });
});
