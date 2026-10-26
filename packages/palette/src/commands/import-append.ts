/* @layer core @kind logic */
import { ERROR_CODE, fail, formatSwatchColor, swatchFields } from '@bxel/document';
import type { Draft, PaletteBank, Swatch, SwatchColorValue, SwatchId } from '@bxel/document';
import { paletteColors } from './palette-colors';
import { updateBank } from './update-bank';
import { warnDuplicates } from './warn-duplicates';

const importAppend = (draft: Draft, bank: PaletteBank, colors: readonly SwatchColorValue[]): void => {
  if (bank.slots.length + colors.length > bank.cap) {
    throw fail(ERROR_CODE.PALETTE_FULL, `${colors.length} colours do not fit the ${bank.cap - bank.slots.length} free slots.`, {
      path: 'options.colors',
    });
  }
  const existing = paletteColors(bank);
  warnDuplicates(draft, bank.name, [...existing, ...colors.map((color) => formatSwatchColor(color.rgb, color.alpha))], existing.length);
  const added = colors.map(
    (color): Swatch => ({
      id: draft.ids.next('sw') as SwatchId,
      kind: 'color',
      ...swatchFields(color.rgb, color.alpha),
      name: formatSwatchColor(color.rgb, color.alpha),
    }),
  );
  updateBank(draft, bank.id, (current) => ({ ...current, slots: [...current.slots, ...added] }));
};

export { importAppend };
