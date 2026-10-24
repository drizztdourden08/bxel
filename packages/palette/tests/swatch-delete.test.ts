/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { celBytes, currentBank, currentSprite, execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';
import { addSprite, bankOf, flatIndices, heroRgba, previewMatchesCommit, rgbaOfSprite, roundTrip } from './palette-rig';
import type { Rig } from './palette-engine';

const del = (rig: Rig, index: number, replacement?: number) =>
  step('swatch.delete', {
    bankId: rig.bankId,
    swatchId: slotId(rig, index),
    ...(replacement === undefined ? {} : { replacementId: slotId(rig, replacement) }),
  });

const expectedAfterDelete = (before: number[], removed: number, replacement: number): number[] => {
  const mapped = before.map((value) => (value === removed ? replacement : value));
  return mapped.map((value) => (value > removed ? value - 1 : value));
};

describe('swatch.delete', () => {
  it('replaces a used swatch, shifts higher slots down and keeps every other colour', () => {
    const rig = makeRig();
    const flatBefore = celBytes(currentSprite(rig));
    const rgbaBefore = heroRgba(rig);
    const nightRgba = rgbaBefore.slice(4, 8);
    const ids = currentBank(rig).slots.map((slot) => slot.id);
    roundTrip(rig, [del(rig, 2, 1)]);
    expect(currentBank(rig).slots.map((slot) => slot.id)).toEqual(ids.filter((_, at) => at !== 2));
    expect(celBytes(currentSprite(rig))).toEqual(expectedAfterDelete(flatBefore, 2, 1));
    const rgbaAfter = heroRgba(rig);
    for (const [pixel, value] of flatBefore.entries()) {
      const expected = value === 2 ? nightRgba : rgbaBefore.slice(pixel * 4, pixel * 4 + 4);
      expect(rgbaAfter.slice(pixel * 4, pixel * 4 + 4)).toEqual(expected);
    }
  });

  it('remaps every sprite on the bank', () => {
    const rig = makeRig();
    const other = addSprite(rig, 'second', rig.bankId, [4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 1, 2, 3, 4, 0, 0]);
    const flatOther = flatIndices(rig, other);
    roundTrip(rig, [del(rig, 3, 4)]);
    expect(flatIndices(rig, other)).toEqual(expectedAfterDelete(flatOther, 3, 4));
    expect(Math.max(...flatIndices(rig, other))).toBeLessThan(currentBank(rig).slots.length);
    expect(Math.max(...celBytes(currentSprite(rig)))).toBeLessThan(currentBank(rig).slots.length);
    expect(rgbaOfSprite(rig, other)).toHaveLength(64);
  });

  it('previews exactly what it commits', () => {
    const rig = makeRig();
    previewMatchesCommit(rig, [del(rig, 2, 1)]);
  });
});

describe('swatch.delete rules', () => {
  it('refuses a used swatch without a replacement and changes nothing', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [del(rig, 2)]))).toBe('SWATCH_IN_USE');
  });

  it('deletes an unused swatch with no replacement', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#112233' })]));
    const rgb = heroRgba(rig);
    roundTrip(rig, [del(rig, 5)]);
    expect(currentBank(rig).slots).toHaveLength(5);
    expect(heroRgba(rig)).toEqual(rgb);
  });

  it('shifts higher slots down when an unused swatch in the middle goes', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#112233' }), step('swatch.add', { bankId: rig.bankId, rgb: '#445566' })]));
    const other = addSprite(rig, 'second', rig.bankId, [6, 6, 0, 0, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6]);
    const rgb = rgbaOfSprite(rig, other);
    roundTrip(rig, [del(rig, 5)]);
    expect(rgbaOfSprite(rig, other)).toEqual(rgb);
    expect(flatIndices(rig, other)).toEqual([5, 5, 0, 0, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5]);
  });

  it('rejects slot 0, the same replacement and unknown swatches', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [del(rig, 0, 1)]))).toBe('TRANSPARENT_SLOT_FIXED');
    expect(rejectionCode(rig, () => execute(rig, [del(rig, 2, 2)]))).toBe('INVALID_OPTION');
    const missing = step('swatch.delete', { bankId: rig.bankId, swatchId: 'sw_zzzzzz' });
    expect(rejectionCode(rig, () => execute(rig, [missing]))).toBe('TARGET_NOT_FOUND');
    const opaque = makeRig({ transparent: false });
    expect(rejectionCode(opaque, () => execute(opaque, [del(opaque, 0, 1)]))).toBe('INVALID_OPTION');
  });

  it('allows slot 0 as the replacement, which erases the pixels', () => {
    const rig = makeRig();
    const flatBefore = celBytes(currentSprite(rig));
    roundTrip(rig, [del(rig, 2, 0)]);
    expect(celBytes(currentSprite(rig))).toEqual(expectedAfterDelete(flatBefore, 2, 0));
  });

  it('updates ramps and drops one that falls below two swatches', () => {
    const rig = makeRig();
    const ids = [1, 2, 3].map((index) => slotId(rig, index));
    succeed(execute(rig, [step('ramp.add', { bankId: rig.bankId, name: 'Violets', swatches: ids })]));
    succeed(execute(rig, [step('ramp.add', { bankId: rig.bankId, name: 'Pair', swatches: [ids[1], ids[0]] })]));
    const result = roundTrip(rig, [del(rig, 2, 1)]);
    expect(bankOf(rig, rig.bankId).ramps.map((ramp) => ramp.swatches)).toEqual([[ids[0], ids[2]]]);
    expect(result.warnings.map((warning) => warning.code)).toEqual(['RAMP_DROPPED']);
  });
});
