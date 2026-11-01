/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, PaletteBank } from '@bxel/document';
import type { Look } from './recolour-plan.type';

const updateStep = (bank: PaletteBank, index: number, look: Look): CommandStep[] => {
  const slot = bank.slots[index];
  if (slot?.kind !== 'color') return [];
  return [{ name: COMMAND_NAME.swatchUpdate, targets: null, options: { bankId: bank.id, swatchId: slot.id, rgb: look.rgb, alpha: look.alpha } }];
};

export { updateStep };
