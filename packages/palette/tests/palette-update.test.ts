/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { celBytes, currentBank, currentSprite, execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';
import { bankOf, heroRgba, previewMatchesCommit, roundTrip } from './palette-rig';
import { createBank } from './import-helpers';
import type { Rig } from './palette-engine';

const update = (rig: Rig, options: object) => step('palette.update', { bankId: rig.bankId, ...options });

const paintedPixels = (rig: Rig): number[] => celBytes(currentSprite(rig)).flatMap((value, pixel) => (value === 0 ? [] : [pixel]));

const coverTargets = (rig: Rig) => ({
  ...step('pixels.patch', {
    rect: { x: 0, y: 0, width: 4, height: 4 },
    pixels: Uint8Array.from({ length: 16 }, () => 1),
  }),
  targets: { sprites: [rig.spriteId], layers: { by: 'all' as const }, frames: { by: 'all' as const } },
});

describe('palette.update name', () => {
  it('renames the bank and undoes exactly', () => {
    const rig = makeRig();
    roundTrip(rig, [update(rig, { name: '  Night shift ' })]);
    expect(currentBank(rig).name).toBe('Night shift');
  });

  it('rejects a name another bank holds, ignoring case, and an invalid name', () => {
    const rig = makeRig();
    createBank(rig, ['#112233', '#445566'], true);
    expect(rejectionCode(rig, () => execute(rig, [update(rig, { name: 'BANK 2' })]))).toBe('NAME_TAKEN');
    expect(rejectionCode(rig, () => execute(rig, [update(rig, { name: '' })]))).toBe('NAME_INVALID');
  });

  it('commits nothing when nothing changes', () => {
    const rig = makeRig();
    const result = succeed(execute(rig, [update(rig, { name: 'Test bank', transparent: true })]));
    expect(result.ok && result.noop).toBe(true);
  });
});

describe('palette.update transparent on', () => {
  it('inserts the transparent swatch, shifts colours up and keeps every painted colour', () => {
    const rig = makeRig({ transparent: false });
    succeed(execute(rig, [step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 0), name: 'Background' })]));
    const flat = celBytes(currentSprite(rig));
    const rgba = heroRgba(rig);
    const names = currentBank(rig).slots.map((slot) => (slot.kind === 'color' ? slot.rgb : null));
    roundTrip(rig, [update(rig, { transparent: true })]);
    const bank = currentBank(rig);
    expect(bank.transparent).toBe(true);
    expect(bank.slots[0]?.kind).toBe('transparent');
    expect(bank.slots.slice(1).map((slot) => (slot.kind === 'color' ? slot.rgb : null))).toEqual(names);
    const background = bank.slots[1];
    expect(background?.kind === 'color' ? background.name : null).toBe(names[0]);
    expect(celBytes(currentSprite(rig))).toEqual(flat.map((value) => (value === 0 ? 0 : value + 1)));
    const after = heroRgba(rig);
    for (const pixel of paintedPixels(rig)) expect(after.slice(pixel * 4, pixel * 4 + 4)).toEqual(rgba.slice(pixel * 4, pixel * 4 + 4));
  });

  it('keeps the flattened picture when fillBackground is set', () => {
    const rig = makeRig({ transparent: false });
    const flat = celBytes(currentSprite(rig));
    const rgba = heroRgba(rig);
    roundTrip(rig, [update(rig, { transparent: true, fillBackground: true })]);
    expect(celBytes(currentSprite(rig))).toEqual(flat.map((value) => value + 1));
    expect(heroRgba(rig)).toEqual(rgba);
  });

  it('needs a free slot', () => {
    const rig = makeRig({ transparent: false, cap: 4 });
    expect(rejectionCode(rig, () => execute(rig, [update(rig, { transparent: true })]))).toBe('PALETTE_FULL');
  });
});

describe('palette.update transparent off', () => {
  it('needs a replacement while slot 0 is in use', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [update(rig, { transparent: false })]))).toBe('SWATCH_IN_USE');
  });

  it('removes the transparent swatch and turns empty pixels into the replacement colour', () => {
    const rig = makeRig();
    const flat = celBytes(currentSprite(rig));
    const rgba = heroRgba(rig);
    roundTrip(rig, [update(rig, { transparent: false, replacementId: slotId(rig, 2) })]);
    const bank = currentBank(rig);
    expect(bank.transparent).toBe(false);
    expect(bank.slots).toHaveLength(4);
    expect(bank.slots[0]?.kind === 'color' ? bank.slots[0].name : null).toBe('Background');
    expect(celBytes(currentSprite(rig))).toEqual(flat.map((value) => (value === 0 ? 1 : value - 1)));
    const after = heroRgba(rig);
    for (const [pixel, value] of flat.entries()) {
      if (value > 1) expect(after.slice(pixel * 4, pixel * 4 + 4)).toEqual(rgba.slice(pixel * 4, pixel * 4 + 4));
    }
  });

  it('keeps empty pixels empty when the replacement becomes the Background', () => {
    const rig = makeRig();
    const flat = celBytes(currentSprite(rig));
    roundTrip(rig, [update(rig, { transparent: false, replacementId: slotId(rig, 1) })]);
    expect(celBytes(currentSprite(rig))).toEqual(flat.map((value) => Math.max(value - 1, 0)));
  });

  it('needs no replacement when no pixel is empty', () => {
    const rig = makeRig();
    succeed(execute(rig, [coverTargets(rig)]));
    roundTrip(rig, [update(rig, { transparent: false })]);
    expect(celBytes(currentSprite(rig)).every((value) => value === 0)).toBe(true);
  });

  it('rejects the transparent swatch as the replacement and a bank with one slot', () => {
    const rig = makeRig();
    const fixed = update(rig, { transparent: false, replacementId: slotId(rig, 0) });
    expect(rejectionCode(rig, () => execute(rig, [fixed]))).toBe('TRANSPARENT_SLOT_FIXED');
    const bankId = createBank(rig, [], true);
    const lone = step('palette.update', { bankId, transparent: false });
    expect(rejectionCode(rig, () => execute(rig, [lone]))).toBe('INVALID_COLOR');
    expect(bankOf(rig, bankId).slots).toHaveLength(1);
  });

  it('previews exactly what it commits', () => {
    const rig = makeRig();
    previewMatchesCommit(rig, [update(rig, { name: 'Flat', transparent: false, replacementId: slotId(rig, 3) })]);
  });
});
