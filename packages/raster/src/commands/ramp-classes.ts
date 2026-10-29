/* @layer core @kind logic */
import type { PaletteBank } from '@bxel/document';
import { rampSlots } from '../shade/ramp-slots';

const rampClasses = (bank: PaletteBank): Uint16Array => {
  const classes = Uint16Array.from({ length: 256 }, (_, slot) => slot);
  const claimed = new Set<number>();
  for (const [at, ramp] of bank.ramps.entries()) {
    for (const slot of rampSlots(bank, ramp.name) ?? []) {
      if (!claimed.has(slot)) {
        claimed.add(slot);
        classes[slot] = 256 + at;
      }
    }
  }
  return classes;
};

export { rampClasses };
