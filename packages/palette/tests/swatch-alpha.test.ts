/* @layer tests @kind test */
import { swatchAlpha } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { currentBank, execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';

const HALF = 128;

const alphaAt = (rig: ReturnType<typeof makeRig>, index: number): number | null => {
  const slot = currentBank(rig).slots[index];
  return slot ? swatchAlpha(slot) : null;
};

describe('swatch alpha in commands', () => {
  it('adds a swatch with an alpha option and names it after the eight digit colour', () => {
    const rig = makeRig();
    const result = succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#FF7A8A', alpha: HALF })]));
    const added = currentBank(rig).slots[5];
    expect(added?.kind === 'color' ? [added.rgb, added.alpha, added.name] : null).toEqual(['#ff7a8a', HALF, '#ff7a8a80']);
    expect(result.ok && result.warnings).toEqual([]);
  });

  it('adds a swatch from an eight digit colour and keeps an opaque one free of alpha', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#11223344' })]));
    succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#112233ff' })]));
    const [first, second] = currentBank(rig).slots.slice(5);
    expect(first?.kind === 'color' ? first.alpha : null).toBe(0x44);
    expect(second?.kind === 'color' ? 'alpha' in second : null).toBe(false);
  });

  it('does not warn when only the alpha differs from a colour in the bank', () => {
    const rig = makeRig();
    const result = succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#4B1FA0', alpha: HALF })]));
    expect(result.ok && result.warnings).toEqual([]);
  });

  it('changes only the alpha of a swatch and flags the bank as recoloured', () => {
    const rig = makeRig();
    const result = succeed(execute(rig, [step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 2), alpha: HALF })]));
    const slot = currentBank(rig).slots[2];
    expect(slot?.kind === 'color' ? slot.rgb : null).toBe('#4b1fa0');
    expect(alphaAt(rig, 2)).toBe(HALF);
    expect(result.ok && result.changes.sprites.map((sprite) => sprite.recolored)).toEqual([true]);
  });

  it('returns a swatch to opaque by setting alpha 255 and drops the field', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 2), alpha: HALF })]));
    succeed(execute(rig, [step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 2), alpha: 255 })]));
    const slot = currentBank(rig).slots[2];
    expect(slot?.kind === 'color' ? 'alpha' in slot : null).toBe(false);
  });

  it('takes the alpha of an eight digit colour when the colour is replaced', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 2), rgb: '#00ff0010' })]));
    expect(alphaAt(rig, 2)).toBe(0x10);
  });

  it('rejects an alpha outside 0 to 255 and a malformed colour', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#000000', alpha: 256 })]))).not.toBeNull();
    expect(rejectionCode(rig, () => execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#0000000' })]))).toBe('INVALID_COLOR');
  });

  it('creates a bank whose colours carry alpha', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('palette.create', { name: 'Glass', cap: 16, transparent: true, colors: ['#ff0000', '#00ff0080', '#0000ff00'] })]));
    const made = rig.engine.state().artwork.banks[1];
    expect(made?.slots.map(swatchAlpha)).toEqual([0, 255, HALF, 0]);
    expect(made?.slots.map((slot) => (slot.kind === 'color' ? slot.name : null))).toEqual([null, '#ff0000', '#00ff0080', '#0000ff00']);
  });

  it('imports colours with alpha in append and replace mode', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('palette.import', { bankId: rig.bankId, colors: ['#aabbcc40'], mode: 'append' })]));
    expect(alphaAt(rig, 5)).toBe(0x40);
    succeed(execute(rig, [step('palette.create', { name: 'Spare', cap: 16, transparent: true, colors: ['#ff0000'] })]));
    const spare = rig.engine.state().artwork.banks[1];
    if (!spare) throw new Error('The spare bank is missing.');
    succeed(execute(rig, [step('palette.import', { bankId: spare.id, colors: ['#010203', '#040506c0'], mode: 'replace' })]));
    expect(rig.engine.state().artwork.banks[1]?.slots.map(swatchAlpha)).toEqual([0, 255, 0xc0]);
  });
});
