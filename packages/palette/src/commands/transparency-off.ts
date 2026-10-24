/* @layer core @kind logic */
import { BACKGROUND_LABEL, ERROR_CODE, fail } from '@bxel/document';
import type { Draft, PaletteBank } from '@bxel/document';
import { identityTable } from '../identity-table';
import { bankSprites } from './bank-sprites';
import { bankUsage } from './bank-usage';
import { remapSprites } from './remap-sprites';
import { slotIndex } from './slot-index';
import { updateBank } from './update-bank';

const emptyTarget = (bank: PaletteBank, used: number, replacementId: string | undefined): number => {
  const path = 'options.replacementId';
  if (replacementId === undefined) {
    if (used > 0) {
      throw fail(ERROR_CODE.SWATCH_IN_USE, `${used} pixels are empty. Choose the colour they take in the opaque bank.`, { path });
    }
    return 0;
  }
  const index = slotIndex(bank, replacementId, path);
  if (index === 0) throw fail(ERROR_CODE.TRANSPARENT_SLOT_FIXED, 'The transparent swatch is being removed. Choose a colour.', { path });
  return index - 1;
};

const transparencyOff = (draft: Draft, bank: PaletteBank, replacementId: string | undefined): void => {
  if (bank.slots.length < 2) {
    throw fail(ERROR_CODE.INVALID_COLOR, 'An opaque bank needs a Background colour.', { path: 'options.transparent' });
  }
  const sprites = bankSprites(draft.artwork, bank.id);
  const table = identityTable();
  table[0] = emptyTarget(bank, bankUsage(sprites)[0] ?? 0, replacementId);
  for (let at = 1; at < bank.slots.length; at += 1) table[at] = at - 1;
  remapSprites(
    draft,
    sprites.map((sprite) => sprite.id),
    table,
  );
  const slots = bank.slots.slice(1).map((slot, at) => (at === 0 && slot.kind === 'color' ? { ...slot, name: BACKGROUND_LABEL } : slot));
  updateBank(draft, bank.id, (current) => ({ ...current, transparent: false, slots }));
};

export { transparencyOff };
