/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { CHANGE_TEXT } from './palette-change.constants';
import { slotName } from './slot-name';

const swatchLine = (bank: PaletteBank, index: number): string => {
  const slot = bank.slots[index];
  return CHANGE_TEXT.swatch(index, slotName(bank, index), slot?.kind === 'color' ? slot.rgb.toUpperCase() : '');
};

export { swatchLine };
