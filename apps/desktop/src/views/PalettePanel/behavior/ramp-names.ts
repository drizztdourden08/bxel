/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';

const rampNames = (bank: PaletteBank, index: number): string => {
  const id = bank.slots[index]?.id;
  return bank.ramps
    .filter((ramp) => id !== undefined && ramp.swatches.includes(id))
    .map((ramp) => ramp.name)
    .join(', ');
};

export { rampNames };
