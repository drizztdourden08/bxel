/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { CHANGE_TEXT } from './palette-change.constants';

const slotName = (bank: PaletteBank, index: number): string => {
  const slot = bank.slots[index];
  return slot?.kind === 'color' ? slot.name.toLowerCase() : CHANGE_TEXT.transparentName;
};

export { slotName };
