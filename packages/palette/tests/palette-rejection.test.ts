/* @layer tests @kind test */
import type { CommandStep } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { currentBank, execute, makeRig, slotId, snapshotProject, step, succeed } from './palette-engine';
import type { Rig } from './palette-engine';

const rejection = (rig: Rig, command: CommandStep) => {
  const revision = rig.engine.state().revision;
  const snapshot = snapshotProject(rig.engine.state().project);
  const result = execute(rig, [command]);
  expect(rig.engine.state().revision).toBe(revision);
  expect(snapshotProject(rig.engine.state().project)).toBe(snapshot);
  if (result.ok) throw new Error('the step was accepted');
  return result.error;
};

const orderOf = (rig: Rig, indices: readonly number[]): string[] => indices.map((index) => slotId(rig, index));

describe('transparent slot', () => {
  it('cannot be edited', () => {
    const rig = makeRig();
    const error = rejection(rig, step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 0), rgb: '#ffffff' }));
    expect(error.code).toBe('TRANSPARENT_SLOT_FIXED');
  });

  it('cannot move off slot 0', () => {
    const rig = makeRig();
    const order = orderOf(rig, [1, 0, 2, 3, 4]);
    const error = rejection(rig, step('palette.reorder', { bankId: rig.bankId, order }));
    expect(error.code).toBe('TRANSPARENT_SLOT_FIXED');
  });

  it('cannot be swapped out by moving another swatch to slot 0', () => {
    const rig = makeRig();
    const order = orderOf(rig, [4, 1, 2, 3, 0]);
    expect(rejection(rig, step('palette.reorder', { bankId: rig.bankId, order })).code).toBe('TRANSPARENT_SLOT_FIXED');
  });
});

describe('palette.reorder rejections', () => {
  it('rejects an order that misses a swatch', () => {
    const rig = makeRig();
    const order = orderOf(rig, [0, 1, 2, 3]);
    expect(rejection(rig, step('palette.reorder', { bankId: rig.bankId, order })).code).toBe('INVALID_PERMUTATION');
  });

  it('rejects an order that repeats a swatch', () => {
    const rig = makeRig();
    const order = orderOf(rig, [0, 1, 1, 3, 4]);
    expect(rejection(rig, step('palette.reorder', { bankId: rig.bankId, order })).code).toBe('INVALID_PERMUTATION');
  });

  it('rejects an id from another bank', () => {
    const rig = makeRig();
    const order = [...orderOf(rig, [0, 1, 2, 3]), 'sw_zzzzzz'];
    expect(rejection(rig, step('palette.reorder', { bankId: rig.bankId, order })).code).toBe('INVALID_PERMUTATION');
  });

  it('keeps the Background colour in slot 0 of an opaque bank', () => {
    const rig = makeRig({ transparent: false });
    const order = orderOf(rig, [1, 0, 2, 3]);
    expect(rejection(rig, step('palette.reorder', { bankId: rig.bankId, order })).code).toBe('INVALID_PERMUTATION');
  });
});

describe('other rejections', () => {
  it('rejects a colour that is not #rrggbb on add and update', () => {
    const rig = makeRig();
    expect(rejection(rig, step('swatch.add', { bankId: rig.bankId, rgb: 'red' })).code).toBe('INVALID_COLOR');
    const update = step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 1), rgb: '#fff' });
    expect(rejection(rig, update).code).toBe('INVALID_COLOR');
  });

  it('rejects a swatch that is not in the bank', () => {
    const rig = makeRig();
    const update = step('swatch.update', { bankId: rig.bankId, swatchId: 'sw_zzzzzz', rgb: '#ffffff' });
    expect(rejection(rig, update).code).toBe('TARGET_NOT_FOUND');
  });

  it('rejects an unknown bank', () => {
    const rig = makeRig();
    expect(rejection(rig, step('palette.resize', { bankId: 'bnk_zzzzzz', cap: 16 })).code).toBe('TARGET_NOT_FOUND');
  });

  it('leaves the bank untouched after a failed batch with a good first step', () => {
    const rig = makeRig();
    const before = currentBank(rig);
    const batch = [step('swatch.add', { bankId: rig.bankId, rgb: '#112233' }), step('palette.resize', { bankId: rig.bankId, cap: 2 })];
    const result = execute(rig, batch);
    expect(result.ok).toBe(false);
    expect(currentBank(rig)).toBe(before);
    succeed(execute(rig, [step('palette.resize', { bankId: rig.bankId, cap: 9 })]));
  });
});
