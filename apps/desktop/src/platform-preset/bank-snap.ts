/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { snapPalette } from '@bxel/presets';
import type { PlatformPreset } from '@bxel/presets';
import type { ColourSlot } from './bank-snap.type';
import type { SnapChange } from './snap-plan.type';

const colourSlots = (bank: PaletteBank): ColourSlot[] =>
  bank.slots.flatMap((slot, index) => (slot.kind === 'color' ? [{ index, id: slot.id, rgb: slot.rgb, name: slot.name }] : []));

const bankSnap = (preset: PlatformPreset, bank: PaletteBank): SnapChange[] | null => {
  const slots = colourSlots(bank);
  const result = snapPalette(preset, slots.map((slot) => slot.rgb));
  if (!result.ok) return null;
  return slots.flatMap((slot, at): SnapChange[] => {
    const after = result.value.colours[at] ?? slot.rgb;
    if (after === slot.rgb.toLowerCase()) return [];
    return [{ bankId: bank.id, bankName: bank.name, swatchId: slot.id, index: slot.index, before: slot.rgb, after, rename: slot.name === slot.rgb }];
  });
};

export { bankSnap };
