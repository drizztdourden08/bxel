/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { FRAME, byId, byIndex, celAt, frameEngine, named, scopedStep } from './frame-engine';
import { apply, celPixels, expectUndoRedo, layerStep, rejection, sprite } from './layer-engine';

const slot = (layer: string, frame: number) => ({ layer: named(layer), frame: byIndex(frame) });
const fxOnly = { layers: { by: 'names', names: ['Fx'] }, frames: { by: 'all' } } as const;
const bodyAll = { layers: { by: 'names', names: ['Body'] }, frames: { by: 'all' } } as const;

describe('cel.clear', () => {
  it('empties the cels in scope as one undo step and drops the cels nobody uses', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, scopedStep('cel.clear', {}, fxOnly));
    expect(celAt(engine, 'Fx', FRAME[0])).toBeUndefined();
    expect(sprite(engine).cels).not.toHaveProperty('cel_000123');
  });

  it('clears one use of a linked cel and keeps the others', () => {
    const engine = frameEngine();
    apply(engine, scopedStep('cel.clear', {}, { layers: bodyAll.layers, frames: { by: 'ids', ids: [FRAME[0]] } }));
    expect(celAt(engine, 'Body', FRAME[0])).toBeUndefined();
    expect(celAt(engine, 'Body', FRAME[1])).toBe('cel_000120');
    expect(sprite(engine).cels).toHaveProperty('cel_000120');
  });

  it('honours a tag scope and skips a locked layer named by all', () => {
    const engine = frameEngine();
    const result = apply(engine, scopedStep('cel.clear', {}, { layers: { by: 'all' }, frames: { by: 'tag', name: 'tail' } }));
    expect(celAt(engine, 'Body', FRAME[2])).toBeUndefined();
    expect(celAt(engine, 'Body', FRAME[3])).toBeUndefined();
    expect(result.warnings.map((warning) => warning.code)).toEqual(['LAYER_LOCKED']);
  });

  it('refuses a locked layer named by id', () => {
    const step = scopedStep('cel.clear', {}, { layers: { by: 'ids', ids: ['lay_000103'] }, frames: { by: 'all' } } as never);
    expect(rejection(frameEngine(), step).code).toBe('LAYER_LOCKED');
  });
});

describe('cel.copy', () => {
  it('copies the pixels into a new cel and leaves the source alone', () => {
    const engine = frameEngine();
    const step = layerStep('cel.copy', { from: slot('Body', 2), to: slot('Fx', 1) });
    expectUndoRedo(engine, step);
    const copy = celAt(engine, 'Fx', FRAME[1]) ?? '';
    expect(copy).not.toBe('cel_000121');
    expect(celPixels(engine, copy)).toEqual(celPixels(engine, 'cel_000121'));
    expect(celAt(engine, 'Body', FRAME[2])).toBe('cel_000121');
  });

  it('replaces the cel at the destination', () => {
    const engine = frameEngine();
    apply(engine, layerStep('cel.copy', { from: slot('Body', 2), to: slot('Fx', 0) }));
    expect(sprite(engine).cels).not.toHaveProperty('cel_000123');
    expect(celPixels(engine, celAt(engine, 'Fx', FRAME[0]))).toEqual(celPixels(engine, 'cel_000121'));
  });

  it('copies an empty cel as an empty cel', () => {
    const engine = frameEngine();
    apply(engine, layerStep('cel.copy', { from: slot('Fx', 3), to: slot('Fx', 0) }));
    expect(celAt(engine, 'Fx', FRAME[0])).toBeUndefined();
  });

  it('refuses the same slot and a locked destination unless allowLocked is given', () => {
    const engine = frameEngine();
    expect(rejection(engine, layerStep('cel.copy', { from: slot('Body', 2), to: slot('Body', 2) })).code).toBe('INVALID_OPTION');
    const locked = { from: slot('Body', 2), to: slot('Frozen', 2) };
    expect(rejection(engine, layerStep('cel.copy', locked)).code).toBe('LAYER_LOCKED');
    apply(engine, layerStep('cel.copy', { ...locked, allowLocked: true }));
    expect(celAt(engine, 'Frozen', FRAME[2])).toBeDefined();
  });
});

describe('cel.move', () => {
  it('moves the cel and empties the source slot', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('cel.move', { from: slot('Body', 2), to: slot('Fx', 2) }));
    expect(celAt(engine, 'Fx', FRAME[2])).toBe('cel_000121');
    expect(celAt(engine, 'Body', FRAME[2])).toBeUndefined();
  });

  it('moves one use of a linked cel', () => {
    const engine = frameEngine();
    apply(engine, layerStep('cel.move', { from: slot('Body', 0), to: slot('Fx', 3) }));
    expect(celAt(engine, 'Fx', FRAME[3])).toBe('cel_000120');
    expect(celAt(engine, 'Body', FRAME[1])).toBe('cel_000120');
    expect(celAt(engine, 'Body', FRAME[0])).toBeUndefined();
  });

  it('drops the cel it replaces when nothing else uses it', () => {
    const engine = frameEngine();
    apply(engine, layerStep('cel.move', { from: slot('Body', 3), to: slot('Fx', 0) }));
    expect(sprite(engine).cels).not.toHaveProperty('cel_000123');
  });

  it('refuses a locked source and leaves the file untouched', () => {
    expect(rejection(frameEngine(), layerStep('cel.move', { from: slot('Frozen', 0), to: slot('Fx', 1) })).code).toBe('LAYER_LOCKED');
  });

  it('accepts frame ids and layer ids', () => {
    const engine = frameEngine();
    const from = { layer: { by: 'id', id: 'lay_000101' }, frame: byId(FRAME[3]) };
    apply(engine, layerStep('cel.move', { from, to: slot('Fx', 1) }));
    expect(celAt(engine, 'Fx', FRAME[1])).toBe('cel_000122');
  });
});
