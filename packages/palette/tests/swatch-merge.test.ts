/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { celBytes, currentBank, currentSprite, execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';
import { bankOf, heroRgba, previewMatchesCommit, roundTrip } from './palette-rig';
import type { Rig } from './palette-engine';

const merge = (rig: Rig, from: number, into: number) =>
  step('swatch.merge', { bankId: rig.bankId, from: slotId(rig, from), into: slotId(rig, into) });

const mergedValue = (value: number): number => {
  if (value <= 2) return value;
  return value - 1;
};

describe('swatch.merge', () => {
  it('recolours the merged swatch into the target and closes the gap', () => {
    const rig = makeRig();
    const flatBefore = celBytes(currentSprite(rig));
    const rgbaBefore = heroRgba(rig);
    const intoRgba = rgbaBefore.slice(12, 16);
    roundTrip(rig, [merge(rig, 2, 3)]);
    expect(currentBank(rig).slots).toHaveLength(4);
    const expected = flatBefore.map(mergedValue);
    expect(celBytes(currentSprite(rig))).toEqual(expected);
    const rgbaAfter = heroRgba(rig);
    for (const [pixel, value] of flatBefore.entries()) {
      const want = value === 2 ? intoRgba : rgbaBefore.slice(pixel * 4, pixel * 4 + 4);
      expect(rgbaAfter.slice(pixel * 4, pixel * 4 + 4)).toEqual(want);
    }
  });

  it('merges a higher slot down into a lower one', () => {
    const rig = makeRig();
    const flatBefore = celBytes(currentSprite(rig));
    roundTrip(rig, [merge(rig, 4, 1)]);
    expect(celBytes(currentSprite(rig))).toEqual(flatBefore.map((value) => (value === 4 ? 1 : value)));
  });

  it('replaces the merged swatch inside ramps without repeating the target', () => {
    const rig = makeRig();
    const ids = [1, 2, 3].map((index) => slotId(rig, index));
    succeed(execute(rig, [step('ramp.add', { bankId: rig.bankId, name: 'Violets', swatches: ids })]));
    roundTrip(rig, [merge(rig, 2, 3)]);
    expect(bankOf(rig, rig.bankId).ramps.map((ramp) => ramp.swatches)).toEqual([[ids[0], ids[2]]]);
  });

  it('rejects slot 0, a self merge and unknown swatches without a change', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [merge(rig, 0, 1)]))).toBe('TRANSPARENT_SLOT_FIXED');
    expect(rejectionCode(rig, () => execute(rig, [merge(rig, 2, 2)]))).toBe('INVALID_OPTION');
    const missing = step('swatch.merge', { bankId: rig.bankId, from: slotId(rig, 1), into: 'sw_zzzzzz' });
    expect(rejectionCode(rig, () => execute(rig, [missing]))).toBe('TARGET_NOT_FOUND');
  });

  it('previews exactly what it commits', () => {
    const rig = makeRig();
    previewMatchesCommit(rig, [merge(rig, 1, 4)]);
  });
});
