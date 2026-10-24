/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { createBank } from './import-helpers';
import { currentBank, execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';
import { bankOf, roundTrip } from './palette-rig';

describe('palette.duplicate', () => {
  it('copies slots, names, cap, transparency and ramps with new ids, in one undo step', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('ramp.add', { bankId: rig.bankId, name: 'Violets', swatches: [slotId(rig, 1), slotId(rig, 3)] })]));
    const source = currentBank(rig);
    const result = roundTrip(rig, [{ ...step('palette.duplicate', { bankId: rig.bankId }), ref: 'copy' }]);
    const copy = bankOf(rig, result.created.copy as never);
    expect(copy.name).toBe(`${source.name} copy`);
    expect(copy.cap).toBe(source.cap);
    expect(copy.transparent).toBe(source.transparent);
    expect(copy.slots.map((slot) => (slot.kind === 'transparent' ? null : slot.rgb))).toEqual(source.slots.map((slot) => (slot.kind === 'transparent' ? null : slot.rgb)));
    expect(copy.slots.every((slot, at) => slot.id !== source.slots[at]?.id)).toBe(true);
    expect(copy.ramps.map((ramp) => ramp.name)).toEqual(['Violets']);
    expect(copy.ramps[0]?.id).not.toBe(source.ramps[0]?.id);
    expect(copy.ramps[0]?.swatches).toEqual([copy.slots[1]?.id, copy.slots[3]?.id]);
  });

  it('takes a name, numbers repeated copies, and refuses a taken name or an unknown bank', () => {
    const rig = makeRig();
    const other = createBank(rig, ['#112233', '#445566'], true);
    succeed(execute(rig, [step('palette.duplicate', { bankId: other, name: 'Night' })]));
    expect(rejectionCode(rig, () => execute(rig, [step('palette.duplicate', { bankId: other, name: 'night' })]))).toBe('NAME_TAKEN');
    succeed(execute(rig, [step('palette.duplicate', { bankId: rig.bankId })]));
    succeed(execute(rig, [step('palette.duplicate', { bankId: rig.bankId })]));
    const names = rig.engine.state().artwork.banks.map((bank) => bank.name);
    expect(names).toEqual(expect.arrayContaining(['Test bank copy', 'Test bank copy 2', 'Night']));
    expect(rejectionCode(rig, () => execute(rig, [step('palette.duplicate', { bankId: 'bnk_zzzzzz' })]))).toBe('TARGET_NOT_FOUND');
  });
});

describe('the created time of a palette', () => {
  it('is set on a duplicate and on a new palette from the clock, and stays unknown without one', () => {
    const at = Date.UTC(2026, 9, 24, 12, 0, 0);
    const rig = makeRig({ clock: () => at });
    const result = roundTrip(rig, [{ ...step('palette.duplicate', { bankId: rig.bankId }), ref: 'copy' }]);
    expect(bankOf(rig, result.created.copy as never).created).toBe(at);
    const created = createBank(rig, ['#112233', '#445566'], true);
    expect(rig.engine.state().artwork.banks.find((bank) => bank.id === created)?.created).toBe(at);
    const plain = makeRig();
    succeed(execute(plain, [step('palette.duplicate', { bankId: plain.bankId })]));
    expect(plain.engine.state().artwork.banks.every((bank) => bank.created === undefined)).toBe(true);
  });
});
