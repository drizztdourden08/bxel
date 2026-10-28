/* @layer renderer-app @kind logic */
import { COMMAND_NAME, swatchAlpha } from '@bxel/document';
import type { CommandStep, PaletteBank } from '@bxel/document';
import { gradientBetween } from '@bxel/palette';

const gradientSteps = (bank: PaletteBank, first: number, last: number): CommandStep[] => {
  const low = Math.min(first, last);
  const high = Math.max(first, last);
  const start = bank.slots[low];
  const end = bank.slots[high];
  if (start?.kind !== 'color' || end?.kind !== 'color' || high - low < 2) return [];
  const colours = gradientBetween(start.rgb, end.rgb, high - low - 1);
  return colours.flatMap((rgb, at): CommandStep[] => {
    const slot = bank.slots[low + at + 1];
    if (slot?.kind !== 'color') return [];
    return [{ name: COMMAND_NAME.swatchUpdate, targets: null, options: { bankId: bank.id, swatchId: slot.id, rgb, alpha: swatchAlpha(slot) } }];
  });
};

export { gradientSteps };
