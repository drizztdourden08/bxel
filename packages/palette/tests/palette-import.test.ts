/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { celBytes, currentBank, currentSprite, execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';
import { bankOf, previewMatchesCommit, roundTrip } from './palette-rig';
import type { Rig } from './palette-engine';

const importStep = (rig: Rig, colors: readonly string[], mode?: 'replace' | 'append') =>
  step('palette.import', { bankId: rig.bankId, colors, ...(mode ? { mode } : {}) });

const rgbs = (rig: Rig): (string | null)[] => currentBank(rig).slots.map((slot) => (slot.kind === 'color' ? slot.rgb : null));

describe('palette.import append', () => {
  it('appends colours as new swatches named after their colour and warns about a duplicate', () => {
    const rig = makeRig();
    const result = roundTrip(rig, [importStep(rig, ['#FF0000', '#00ff00', '#4b1fa0'])]);
    expect(rgbs(rig).slice(5)).toEqual(['#ff0000', '#00ff00', '#4b1fa0']);
    const added = currentBank(rig).slots[5];
    expect(added?.kind === 'color' ? added.name : null).toBe('#ff0000');
    expect(result.warnings.map((warning) => warning.code)).toEqual(['DUPLICATE_COLOR']);
  });

  it('fills the bank to its cap and no further', () => {
    const rig = makeRig({ cap: 7 });
    succeed(execute(rig, [importStep(rig, ['#ff0000', '#00ff00'], 'append')]));
    expect(currentBank(rig).slots).toHaveLength(7);
    expect(rejectionCode(rig, () => execute(rig, [importStep(rig, ['#0000ff'])]))).toBe('PALETTE_FULL');
  });

  it('rejects an invalid colour', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [importStep(rig, ['#ff0000', 'red'])]))).toBe('INVALID_COLOR');
  });

  it('previews exactly what it commits', () => {
    const rig = makeRig();
    previewMatchesCommit(rig, [importStep(rig, ['#ff0000', '#4b1fa0'])]);
  });
});

describe('palette.import replace', () => {
  it('recolours positionally, keeps swatch ids and every pixel index', () => {
    const rig = makeRig();
    const ids = currentBank(rig).slots.map((slot) => slot.id);
    const flat = celBytes(currentSprite(rig));
    roundTrip(rig, [importStep(rig, ['#010101', '#020202', '#030303', '#040404'], 'replace')]);
    expect(currentBank(rig).slots.map((slot) => slot.id)).toEqual(ids);
    expect(rgbs(rig)).toEqual([null, '#010101', '#020202', '#030303', '#040404']);
    expect(celBytes(currentSprite(rig))).toEqual(flat);
  });

  it('keeps the name of a swatch whose colour does not change', () => {
    const rig = makeRig();
    succeed(execute(rig, [importStep(rig, ['#140b26', '#020202', '#7b3fe4', '#b02a9c'], 'replace')]));
    const names = currentBank(rig).slots.map((slot) => (slot.kind === 'color' ? slot.name : null));
    expect(names).toEqual([null, 'Night', '#020202', 'Violet', 'Magenta']);
  });

  it('grows the bank with new swatches within the cap', () => {
    const rig = makeRig({ cap: 6 });
    roundTrip(rig, [importStep(rig, ['#010101', '#020202', '#030303', '#040404', '#050505'], 'replace')]);
    expect(currentBank(rig).slots).toHaveLength(6);
    expect(rejectionCode(rig, () => execute(rig, [importStep(rig, new Array<string>(6).fill('#050505'), 'replace')]))).toBe('PALETTE_FULL');
  });

  it('drops unused trailing swatches and prunes ramps', () => {
    const rig = makeRig();
    succeed(execute(rig, [importStep(rig, ['#111111', '#222222'])]));
    const tail = [5, 6].map((index) => slotId(rig, index));
    succeed(execute(rig, [step('ramp.add', { bankId: rig.bankId, name: 'Tail', swatches: [slotId(rig, 1), slotId(rig, 2), slotId(rig, 5)] })]));
    succeed(execute(rig, [step('ramp.add', { bankId: rig.bankId, name: 'Doomed', swatches: tail })]));
    const result = roundTrip(rig, [importStep(rig, ['#010101', '#020202', '#030303', '#040404'], 'replace')]);
    expect(currentBank(rig).slots).toHaveLength(5);
    expect(bankOf(rig, rig.bankId).ramps.map((ramp) => ramp.name)).toEqual(['Tail']);
    expect(bankOf(rig, rig.bankId).ramps[0]?.swatches).toEqual([slotId(rig, 1), slotId(rig, 2)]);
    expect(result.warnings.map((warning) => warning.code)).toContain('RAMP_DROPPED');
  });

  it('refuses a shorter list while a dropped slot is in use', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [importStep(rig, ['#010101', '#020202'], 'replace')]))).toBe('SWATCH_IN_USE');
  });

  it('keeps the Background label in an opaque bank and needs one colour', () => {
    const rig = makeRig({ transparent: false });
    succeed(execute(rig, [importStep(rig, ['#010101', '#020202', '#030303', '#040404'], 'replace')]));
    const first = currentBank(rig).slots[0];
    expect(first?.kind === 'color' ? [first.rgb, first.name] : null).toEqual(['#010101', 'Background']);
    expect(rejectionCode(rig, () => execute(rig, [importStep(rig, [], 'replace')]))).toBe('INVALID_COLOR');
  });

  it('previews exactly what it commits', () => {
    const rig = makeRig();
    previewMatchesCommit(rig, [importStep(rig, ['#010101', '#020202', '#030303', '#040404', '#050505'], 'replace')]);
  });
});
