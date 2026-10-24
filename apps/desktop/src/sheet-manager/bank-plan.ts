/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, BankId, Sprite } from '@bxel/document';
import { bankMerges } from './bank-merges';
import { BANK_PICK_TEXT } from './bank-text.constants';
import type { BankPlan } from './bank.type';

const blockerOf = (movers: number, colours: number, hasColour: boolean): string | null => {
  if (movers === 0) return BANK_PICK_TEXT.nothing;
  return colours > 0 && !hasColour ? BANK_PICK_TEXT.noColour : null;
};

const bankPlan = (artwork: Artwork, targets: readonly Sprite[], bankId: BankId): BankPlan => {
  const dest = findBank(artwork, bankId);
  const movers = targets.filter((sprite) => sprite.bankId !== bankId);
  const skipped = targets.length - movers.length;
  if (!dest) return { movers: [], skipped, colours: 0, merged: 0, blocker: BANK_PICK_TEXT.noOther };
  const merges = bankMerges(artwork, movers, dest);
  const hasColour = dest.slots.some((slot, at) => at > 0 && slot.kind === 'color');
  return { movers, skipped, ...merges, blocker: blockerOf(movers.length, merges.colours, hasColour) };
};

export { bankPlan };
