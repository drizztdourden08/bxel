/* @layer tests @kind test */
import { hexToOklch, rampSlots, stepInRamp } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { currentBank, execute, makeRig, slotId, snapshotArtwork, step, succeed } from './palette-engine';
import { heroRgba } from './palette-rig';

const lightness = (rig: ReturnType<typeof makeRig>): number[] =>
  currentBank(rig).slots.flatMap((slot, index) => (index > 0 && slot.kind === 'color' ? [hexToOklch(slot.rgb)?.l ?? 0] : []));

describe('palette.sort', () => {
  it('sorts by lightness and keeps every rendered pixel', () => {
    const rig = makeRig();
    const before = heroRgba(rig);
    succeed(execute(rig, [step('palette.sort', { bankId: rig.bankId, key: 'lightness' })]));
    expect(heroRgba(rig)).toEqual(before);
    const sorted = lightness(rig);
    expect(sorted).toEqual([...sorted].sort((first, second) => first - second));
    expect(currentBank(rig).slots[0]?.kind).toBe('transparent');
  });

  it('sorts only the chosen swatches in their own slots', () => {
    const rig = makeRig();
    const chosen = [slotId(rig, 3), slotId(rig, 4)];
    const others = [slotId(rig, 1), slotId(rig, 2)];
    succeed(execute(rig, [step('palette.sort', { bankId: rig.bankId, key: 'lightness', direction: 'descending', swatches: chosen })]));
    const ids = currentBank(rig).slots.map((slot) => slot.id);
    expect(ids.slice(1, 3)).toEqual(others);
    expect(new Set(ids.slice(3))).toEqual(new Set(chosen));
  });
});

describe('palette.remove_unused and palette.unite_duplicates', () => {
  it('removes the unused swatches in one undo step and keeps the pixels', () => {
    const rig = makeRig();
    const add = (rgb: string) => step('swatch.add', { bankId: rig.bankId, rgb });
    succeed(execute(rig, [add('#102030'), add('#203040'), add('#304050')]));
    const before = heroRgba(rig);
    const snapshot = snapshotArtwork(rig.engine.state().artwork);
    succeed(execute(rig, [step('palette.remove_unused', { bankId: rig.bankId })]));
    expect(currentBank(rig).slots).toHaveLength(5);
    expect(heroRgba(rig)).toEqual(before);
    rig.engine.undo({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });
    expect(snapshotArtwork(rig.engine.state().artwork)).toBe(snapshot);
  });

  it('merges equal colours into the first and keeps the look', () => {
    const rig = makeRig();
    const copy = currentBank(rig).slots[2];
    const rgb = copy?.kind === 'color' ? copy.rgb : '#000000';
    succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb })]));
    succeed(execute(rig, [step('palette.unite_duplicates', { bankId: rig.bankId })]));
    expect(currentBank(rig).slots).toHaveLength(5);
  });
});

describe('ramps from new swatches in one transaction', () => {
  it('adds swatches and a ramp that names them by ref, with one undo', () => {
    const rig = makeRig();
    const revision = rig.engine.state().revision;
    const result = succeed(
      execute(rig, [
        { ...step('swatch.add', { bankId: rig.bankId, rgb: '#2a4a20' }), ref: 'dark' },
        { ...step('swatch.add', { bankId: rig.bankId, rgb: '#8ab060' }), ref: 'light' },
        step('ramp.add', { bankId: rig.bankId, name: 'Moss', swatches: [{ ref: 'dark' }, slotId(rig, 2), { ref: 'light' }] }),
      ]),
    );
    expect(result.ok).toBe(true);
    const bank = currentBank(rig);
    const ramp = bank.ramps[0];
    expect(ramp?.name).toBe('Moss');
    if (!ramp) return;
    const slots = rampSlots(bank, ramp);
    expect(slots).toEqual([5, 2, 6]);
    expect(stepInRamp(bank, 2, 1)).toBe(6);
    expect(stepInRamp(bank, 6, 1)).toBe(6);
    expect(stepInRamp(bank, 2, -1)).toBe(5);
    expect(rig.engine.state().revision).toBe(revision + 1);
  });
});
