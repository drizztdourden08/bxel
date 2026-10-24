/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank, SwatchId } from '@bxel/document';
import { slotIndex } from './slot-index';

const checkRampSwatches = (bank: PaletteBank, ids: readonly string[], path: string): SwatchId[] => {
  for (const [at, id] of ids.entries()) {
    const slot = bank.slots[slotIndex(bank, id, `${path}.${at}`)];
    if (slot?.kind !== 'color') {
      throw fail(ERROR_CODE.INVALID_OPTION, 'A ramp holds colour swatches, not the transparent swatch.', { path: `${path}.${at}` });
    }
    if (ids.indexOf(id) !== at) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Swatch ${id} appears twice in the ramp.`, { path: `${path}.${at}` });
    }
  }
  return ids as SwatchId[];
};

export { checkRampSwatches };
