/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';

const slotIndex = (bank: PaletteBank, swatchId: string, path: string): number => {
  const index = bank.slots.findIndex((slot) => slot.id === swatchId);
  if (index < 0) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Swatch ${swatchId} is not in bank ${bank.id}.`, { path });
  return index;
};

export { slotIndex };
