/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';

const checkRemovable = (bank: PaletteBank, index: number, path: string): void => {
  if (index > 0) return;
  if (bank.transparent) throw fail(ERROR_CODE.TRANSPARENT_SLOT_FIXED, 'The transparent swatch stays in slot 0.', { path });
  throw fail(ERROR_CODE.INVALID_OPTION, 'The Background swatch stays in slot 0 of an opaque bank.', { path });
};

export { checkRemovable };
