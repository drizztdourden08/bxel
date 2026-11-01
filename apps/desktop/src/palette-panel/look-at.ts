/* @layer renderer-app @kind logic */
import { swatchAlpha } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import type { Look } from './recolour-plan.type';

const lookAt = (bank: PaletteBank, index: number): Look | null => {
  const slot = bank.slots[index];
  return slot?.kind === 'color' ? { rgb: slot.rgb, alpha: swatchAlpha(slot) } : null;
};

export { lookAt };
