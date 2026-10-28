/* @layer core @kind logic */
import type { PaletteBank } from '@bxel/document';
import { rampSlots } from '../shade/ramp-slots';
import { shadeTable } from '../shade/shade-table';
import type { Ink } from './ink.type';

const autoTable = (bank: PaletteBank, direction: 'up' | 'down', steps: number): Uint8Array => {
  const table = Uint8Array.from({ length: 256 }, (_, slot) => slot);
  const claimed = new Set<number>();
  for (const ramp of bank.ramps) {
    const slots = rampSlots(bank, ramp.name) ?? [];
    const one = shadeTable({ slots, direction, steps });
    for (const slot of slots) {
      if (!claimed.has(slot)) {
        claimed.add(slot);
        table[slot] = one[slot] ?? slot;
      }
    }
  }
  return table;
};

const inkTable = (bank: PaletteBank, ink: Ink | undefined): Uint8Array | null => {
  if (!ink) return null;
  if (ink.kind === 'lighten') return autoTable(bank, 'up', ink.steps);
  if (ink.kind === 'darken') return autoTable(bank, 'down', ink.steps);
  if (ink.kind !== 'shade') return null;
  if (ink.ramp === undefined) return autoTable(bank, ink.direction, ink.steps);
  const slots = rampSlots(bank, ink.ramp);
  return slots ? shadeTable({ slots, direction: ink.direction, steps: ink.steps }) : null;
};

export { inkTable };
