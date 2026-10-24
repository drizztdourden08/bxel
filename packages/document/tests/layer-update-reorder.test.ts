/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { MUSHROOM, MUSHROOM_B, apply, expectUndoRedo, layerEngine, layerNames, layerOf, layerStep, named, rejection } from './layer-engine';

describe('layer.update', () => {
  it('renames, hides and locks in one undo step', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.update', { layer: named('Paint'), name: 'Ink', visible: false, locked: true }));
    expect(layerOf(engine, 'Ink')).toMatchObject({ visible: false, locked: true });
  });

  it('allows a change of letter case only', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.update', { layer: named('body'), name: 'BODY' }));
    expect(layerNames(engine)).toContain('BODY');
  });

  it('unlocks a locked layer', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.update', { layer: named('Frozen'), locked: false }));
    expect(layerOf(engine, 'Frozen').locked).toBe(false);
  });

  it('is a no-op when nothing changes', () => {
    const engine = layerEngine();
    const result = apply(engine, layerStep('layer.update', { layer: named('Body'), visible: true }));
    expect(result.noop).toBe(true);
    expect(engine.state().revision).toBe(1);
    expect(engine.canUndo()).toBe(false);
  });

  it('rejects a name another layer holds, ignoring case', () => {
    expect(rejection(layerEngine(), layerStep('layer.update', { layer: named('Paint'), name: 'shadow' })).code).toBe('NAME_TAKEN');
  });

  it('rejects an update that gives nothing to change', () => {
    const error = rejection(layerEngine(), layerStep('layer.update', { layer: named('Paint') }));
    expect(error.code).toBe('INVALID_OPTION');
    expect(error.path).toBe('steps.0.options');
  });

  it('rejects a layer id with several sprites', () => {
    const step = layerStep('layer.update', { layer: { by: 'id', id: 'lay_000102' }, visible: false }, [MUSHROOM, MUSHROOM_B]);
    expect(rejection(layerEngine(), step).code).toBe('INVALID_OPTION');
  });

  it('hides by layer name in several sprites', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.update', { layer: named('Outline'), visible: false }, [MUSHROOM, MUSHROOM_B]));
    expect(layerOf(engine, 'Outline', MUSHROOM).visible).toBe(false);
    expect(layerOf(engine, 'Outline', MUSHROOM_B).visible).toBe(false);
  });
});

describe('layer.reorder', () => {
  it('moves a layer to a position, counted from the bottom', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.reorder', { layer: named('Body'), to: 5 }));
    expect(layerNames(engine)).toEqual(['Shadow', 'Frozen', 'Paint', 'Ghost', 'Outline', 'Body']);
  });

  it('moves a layer down', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.reorder', { layer: named('Outline'), to: 0 }));
    expect(layerNames(engine)[0]).toBe('Outline');
  });

  it('moves a locked layer, since order changes no pixel', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.reorder', { layer: named('Frozen'), to: 0 }));
    expect(layerNames(engine)[0]).toBe('Frozen');
  });

  it('is a no-op at the same position', () => {
    const engine = layerEngine();
    expect(apply(engine, layerStep('layer.reorder', { layer: named('Body'), to: 1 })).noop).toBe(true);
    expect(engine.canUndo()).toBe(false);
  });

  it('rejects a position past the top', () => {
    const error = rejection(layerEngine(), layerStep('layer.reorder', { layer: named('Body'), to: 6 }));
    expect(error.code).toBe('INDEX_OUT_OF_RANGE');
  });

  it('rejects a position that one of several sprites cannot take', () => {
    const error = rejection(layerEngine(), layerStep('layer.reorder', { layer: named('Body'), to: 3 }, [MUSHROOM, MUSHROOM_B]));
    expect(error.code).toBe('INDEX_OUT_OF_RANGE');
    expect(error.details.map((issue) => issue.spriteId)).toEqual([MUSHROOM_B]);
  });
});
