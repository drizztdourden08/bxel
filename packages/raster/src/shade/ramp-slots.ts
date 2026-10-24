/* @layer core @kind logic */
import { nameKey } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';

const rampSlots = (bank: PaletteBank, name: string): number[] | null => {
  const ramp = bank.ramps.find((candidate) => nameKey(candidate.name) === nameKey(name));
  if (!ramp) {
    return null;
  }
  const slots: number[] = [];
  for (const swatchId of ramp.swatches) {
    const slot = bank.slots.findIndex((swatch) => swatch.id === swatchId && swatch.kind === 'color');
    if (slot >= 0 && !slots.includes(slot)) {
      slots.push(slot);
    }
  }
  return slots;
};

export { rampSlots };
