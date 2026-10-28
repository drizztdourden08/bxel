/* @layer core @kind logic */
import type { Artwork, PaletteBank, SwatchId } from '@bxel/document';
import { bankSprites } from './bank-sprites';
import { bankUsage } from './bank-usage';

const unusedSwatches = (artwork: Artwork, bank: PaletteBank, among?: readonly string[]): SwatchId[] => {
  const usage = bankUsage(bankSprites(artwork, bank.id));
  const chosen = among ? new Set(among) : null;
  return bank.slots.flatMap((slot, index) =>
    index > 0 && slot.kind === 'color' && (usage[index] ?? 0) === 0 && (!chosen || chosen.has(slot.id)) ? [slot.id] : [],
  );
};

export { unusedSwatches };
