/* @layer renderer-app @kind logic */
import { swatchAlpha } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import { unitToAlpha } from '../../../palette-bank/unit-to-alpha';
import type { SwatchEditModel } from '../PalettePanel.type';

const sameSwatch = (bank: PaletteBank, editor: SwatchEditModel): number | null => {
  const rgb = editor.value.toLowerCase();
  const alpha = unitToAlpha(editor.alpha);
  const found = bank.slots.findIndex((slot, index) => index !== editor.index && slot.kind === 'color' && slot.rgb.toLowerCase() === rgb && swatchAlpha(slot) === alpha);
  return found < 0 ? null : found;
};

export { sameSwatch };
