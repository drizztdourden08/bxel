/* @layer core @kind logic */
import { formatSwatchColor } from '@bxel/document';
import type { Draft, PaletteBank, SwatchColorValue } from '@bxel/document';
import { checkReplacement } from './check-replacement';
import { recolorSwatch } from './recolor-swatch';
import { rewriteRamps } from './rewrite-ramps';
import { updateBank } from './update-bank';
import { warnDuplicates } from './warn-duplicates';

const importReplace = (draft: Draft, bank: PaletteBank, colors: readonly SwatchColorValue[]): void => {
  checkReplacement(draft.artwork, bank, colors.length);
  const floor = bank.transparent ? 1 : 0;
  const body = colors.map((color, at) => recolorSwatch(draft.ids, bank.slots[floor + at], color, !bank.transparent && at === 0));
  const dropped = bank.slots.slice(floor + colors.length);
  const ramps = rewriteRamps(draft, bank.ramps, new Map(dropped.map((slot) => [slot.id, null])));
  warnDuplicates(
    draft,
    bank.name,
    colors.map((color) => formatSwatchColor(color.rgb, color.alpha)),
  );
  updateBank(draft, bank.id, (current) => ({ ...current, slots: [...current.slots.slice(0, floor), ...body], ramps }));
};

export { importReplace };
