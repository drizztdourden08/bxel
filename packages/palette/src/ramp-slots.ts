/* @layer core @kind logic */
import type { PaletteBank, Ramp } from '@bxel/document';

const rampSlots = (bank: PaletteBank, ramp: Ramp): number[] => {
  const position = new Map(bank.slots.map((slot, index) => [slot.id, index] as const));
  return ramp.swatches.flatMap((id) => {
    const index = position.get(id);
    return index === undefined ? [] : [index];
  });
};

export { rampSlots };
