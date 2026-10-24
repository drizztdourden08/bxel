/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { Draft, PaletteBank, Rgb, Swatch, SwatchId } from '@bxel/document';
import { paletteColors } from './palette-colors';
import { updateBank } from './update-bank';
import { warnDuplicates } from './warn-duplicates';

const importAppend = (draft: Draft, bank: PaletteBank, colors: readonly Rgb[]): void => {
  if (bank.slots.length + colors.length > bank.cap) {
    throw fail(ERROR_CODE.PALETTE_FULL, `${colors.length} colours do not fit the ${bank.cap - bank.slots.length} free slots.`, {
      path: 'options.colors',
    });
  }
  const existing = paletteColors(bank);
  warnDuplicates(draft, bank.name, [...existing, ...colors], existing.length);
  const added = colors.map((rgb): Swatch => ({ id: draft.ids.next('sw') as SwatchId, kind: 'color', rgb, name: rgb }));
  updateBank(draft, bank.id, (current) => ({ ...current, slots: [...current.slots, ...added] }));
};

export { importAppend };
