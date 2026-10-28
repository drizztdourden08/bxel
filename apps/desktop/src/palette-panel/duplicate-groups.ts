/* @layer renderer-app @kind logic */
import { swatchAlpha } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';

const duplicateGroups = (bank: PaletteBank): number[][] => {
  const groups = new Map<string, number[]>();
  bank.slots.forEach((slot, index) => {
    if (slot.kind !== 'color') return;
    const key = `${slot.rgb.toLowerCase()}/${swatchAlpha(slot)}`;
    groups.set(key, [...(groups.get(key) ?? []), index]);
  });
  return [...groups.values()].filter((group) => group.length > 1);
};

export { duplicateGroups };
