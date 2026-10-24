/* @layer core @kind logic */
import { BACKGROUND_LABEL, ERROR_CODE, fail } from '@bxel/document';
import type { Draft, PaletteBank, Swatch, SwatchId } from '@bxel/document';
import { identityTable } from '../identity-table';
import { bankSprites } from './bank-sprites';
import { remapSprites } from './remap-sprites';
import { updateBank } from './update-bank';

const transparencyOn = (draft: Draft, bank: PaletteBank, fillBackground: boolean): void => {
  if (bank.slots.length >= bank.cap) {
    throw fail(ERROR_CODE.PALETTE_FULL, `Bank "${bank.name}" has no free slot for the transparent swatch.`, {
      path: 'options.transparent',
    });
  }
  const table = identityTable();
  table[0] = fillBackground ? 1 : 0;
  for (let at = 1; at < bank.slots.length; at += 1) table[at] = at + 1;
  remapSprites(
    draft,
    bankSprites(draft.project, bank.id).map((sprite) => sprite.id),
    table,
  );
  const lead: Swatch = { id: draft.ids.next('sw') as SwatchId, kind: 'transparent' };
  const shifted = bank.slots.map((slot) => (slot.kind === 'color' && slot.name === BACKGROUND_LABEL ? { ...slot, name: slot.rgb } : slot));
  updateBank(draft, bank.id, (current) => ({ ...current, transparent: true, slots: [lead, ...shifted] }));
};

export { transparencyOn };
