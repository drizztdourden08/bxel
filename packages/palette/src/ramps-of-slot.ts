/* @layer core @kind logic */
import type { PaletteBank, Ramp } from '@bxel/document';

const rampsOfSlot = (bank: PaletteBank, index: number): Ramp[] => {
  const id = bank.slots[index]?.id;
  return id === undefined ? [] : bank.ramps.filter((ramp) => ramp.swatches.includes(id));
};

export { rampsOfSlot };
