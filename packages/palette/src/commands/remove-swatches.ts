/* @layer core @kind logic */
import { requireBank } from '@bxel/document';
import type { BankId, Draft } from '@bxel/document';
import { removeSwatch } from './remove-swatch';
import type { SwatchFold } from './swatch-removal.type';

const removeSwatches = (draft: Draft, bankId: BankId, folds: readonly SwatchFold[]): void => {
  for (const fold of folds) {
    const bank = requireBank(draft.artwork, bankId);
    const removed = bank.slots.findIndex((slot) => slot.id === fold.from);
    if (removed <= 0) continue;
    const into = fold.into === null ? 0 : bank.slots.findIndex((slot) => slot.id === fold.into);
    removeSwatch(draft, { bank, removed, replacement: Math.max(0, into), substitute: fold.into });
  }
};

export { removeSwatches };
