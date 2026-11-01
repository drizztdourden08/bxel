/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { celBytes, currentBank, currentSprite, execute, makeRig, rejectionCode, step, succeed } from './palette-engine';
import { previewMatchesCommit, roundTrip } from './palette-rig';

const mapStep = (bankId: Parameters<typeof step>[1], colors: readonly string[]) => step('palette.import', { bankId, colors, mode: 'map' });

describe('palette.import map', () => {
  it('moves every pixel to the nearest imported colour and replaces the bank colours', () => {
    const rig = makeRig();
    const before = Array.from(celBytes(currentSprite(rig)));
    roundTrip(rig, [mapStep(rig.bankId, ['#000000', '#ff00ff', '#ffffff'])]);
    const table = [0, 1, 1, 2, 2];
    expect(Array.from(celBytes(currentSprite(rig)))).toEqual(before.map((value) => table[value]));
    expect(currentBank(rig).slots.map((slot) => (slot.kind === 'color' ? slot.rgb : null))).toEqual([null, '#000000', '#ff00ff', '#ffffff']);
  });

  it('keeps the look when the imported list is the bank itself', () => {
    const rig = makeRig();
    const before = Array.from(celBytes(currentSprite(rig)));
    const same = currentBank(rig).slots.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : []));
    succeed(execute(rig, [mapStep(rig.bankId, same)]));
    expect(Array.from(celBytes(currentSprite(rig)))).toEqual(before);
  });

  it('refuses a list that does not fit the colour limit', () => {
    const rig = makeRig({ cap: 5 });
    const five = ['#000000', '#111111', '#222222', '#333333', '#444444'];
    expect(rejectionCode(rig, () => execute(rig, [mapStep(rig.bankId, five)]))).toBe('PALETTE_FULL');
  });

  it('previews exactly what it commits', () => {
    const rig = makeRig();
    previewMatchesCommit(rig, [mapStep(rig.bankId, ['#000000', '#ffffff'])]);
  });
});
