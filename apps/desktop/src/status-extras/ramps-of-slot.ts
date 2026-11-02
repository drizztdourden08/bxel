/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';

const rampsOfSlot = (bank: PaletteBank, index: number): string => {
  const swatch = bank.slots[index];
  if (!swatch) return '';
  return bank.ramps
    .filter((ramp) => ramp.swatches.includes(swatch.id))
    .map((ramp) => ramp.name)
    .join(', ');
};

export { rampsOfSlot };
