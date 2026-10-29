/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import { sheetAnimationPlaceSchema } from '../../schema/sheet-animation-place-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { entryMissing } from './entry-missing';
import { pickSheetEntries } from './pick-sheet-entries';
import { warnOverlaps } from './warn-overlaps';

const sheetAnimationPlace = defineCommand({
  name: COMMAND_NAME.sheetAnimationPlace,
  scope: 'none',
  schema: sheetAnimationPlaceSchema,
  run: (draft, input) => {
    const { sheet, animation, entries, hit } = pickSheetEntries(draft, input.options);
    if (!entries.some(hit)) throw entryMissing(animation, sheet);
    const { at } = input.options;
    const next = entries.map((entry) => (hit(entry) ? { ...entry, at } : entry));
    updateSheet(draft, sheet.id, (current) => ({ ...current, layout: { kind: 'manual' }, animationEntries: next }));
    warnOverlaps(draft, sheet.id);
  },
});

export { sheetAnimationPlace };
