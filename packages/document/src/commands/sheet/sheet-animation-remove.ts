/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import { arrangeSheet } from '../../sheet/arrange-sheet';
import { sheetAnimationRemoveSchema } from '../../schema/sheet-animation-remove-schema';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { entryMissing } from './entry-missing';
import { pickSheetEntries } from './pick-sheet-entries';

const sheetAnimationRemove = defineCommand({
  name: COMMAND_NAME.sheetAnimationRemove,
  scope: 'none',
  schema: sheetAnimationRemoveSchema,
  run: (draft, input) => {
    const { sheet, animation, entries, hit } = pickSheetEntries(draft, input.options);
    if (!entries.some(hit)) throw entryMissing(animation, sheet);
    const sizes = sheetSizes(draft.artwork);
    updateSheet(draft, sheet.id, (current) => arrangeSheet({ ...current, animationEntries: entries.filter((entry) => !hit(entry)) }, sizes, draft.artwork.animations));
  },
});

export { sheetAnimationRemove };
