/* @layer core @kind logic */
import type { PaletteBank } from '@bxel/document';
import { rampSlots } from '../shade/ramp-slots';
import { shadeTable } from '../shade/shade-table';

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

export { autoTable };
