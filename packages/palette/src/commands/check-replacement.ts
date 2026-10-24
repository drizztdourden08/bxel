/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank, Artwork } from '@bxel/document';
import { bankSprites } from './bank-sprites';
import { bankUsage } from './bank-usage';

const checkReplacement = (artwork: Artwork, bank: PaletteBank, count: number): void => {
  const floor = bank.transparent ? 1 : 0;
  if (floor + count > bank.cap) {
    throw fail(ERROR_CODE.PALETTE_FULL, `${count} colours do not fit a cap of ${bank.cap}.`, { path: 'options.colors' });
  }
  if (!bank.transparent && count === 0) {
    throw fail(ERROR_CODE.INVALID_COLOR, 'An opaque bank needs a Background colour.', { path: 'options.colors' });
  }
  const usage = bankUsage(bankSprites(artwork, bank.id));
  for (let slot = floor + count; slot < bank.slots.length; slot += 1) {
    if ((usage[slot] ?? 0) > 0) {
      throw fail(ERROR_CODE.SWATCH_IN_USE, `Slot ${slot} is in use and the new list is shorter. Merge or delete it first.`, {
        path: 'options.colors',
      });
    }
  }
};

export { checkReplacement };
