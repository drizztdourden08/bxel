/* @layer core @kind logic */
import type { Draft } from '@bxel/document';
import { buildRemoveTable } from '../build-remove-table';
import { bankSprites } from './bank-sprites';
import { remapSprites } from './remap-sprites';
import { rewriteRamps } from './rewrite-ramps';
import type { SwatchRemoval } from './swatch-removal.type';
import { updateBank } from './update-bank';

const removeSwatch = (draft: Draft, removal: SwatchRemoval): void => {
  const { bank, removed, replacement, substitute } = removal;
  const table = buildRemoveTable({ slotCount: bank.slots.length, removed, replacement });
  remapSprites(
    draft,
    bankSprites(draft.project, bank.id).map((sprite) => sprite.id),
    table,
  );
  const gone = bank.slots[removed];
  const ramps = rewriteRamps(draft, bank.ramps, new Map(gone ? [[gone.id, substitute]] : []));
  updateBank(draft, bank.id, (current) => ({ ...current, slots: current.slots.filter((_, at) => at !== removed), ramps }));
};

export { removeSwatch };
