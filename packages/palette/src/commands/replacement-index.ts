/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import { slotIndex } from './slot-index';

const replacementIndex = (bank: PaletteBank, swatchId: string, removed: number, path: string): number => {
  const index = slotIndex(bank, swatchId, path);
  if (index === removed) throw fail(ERROR_CODE.INVALID_OPTION, 'The replacement must be a different swatch.', { path });
  return index;
};

export { replacementIndex };
