/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import { sheetAnimationMoveSchema } from '../../schema/sheet-animation-move-schema';
import { arrangeSheet } from '../../sheet/arrange-sheet';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { entryMissing } from './entry-missing';
import { pickSheetEntries } from './pick-sheet-entries';

const sheetAnimationMove = defineCommand({
  name: COMMAND_NAME.sheetAnimationMove,
  scope: 'none',
  schema: sheetAnimationMoveSchema,
  run: (draft, input) => {
    const { sheet, animation, entries, hit } = pickSheetEntries(draft, input.options);
    const from = entries.findIndex(hit);
    const moved = entries[from];
    if (!moved) throw entryMissing(animation, sheet);
    const rest = entries.filter((_entry, index) => index !== from);
    const at = Math.min(rest.length, input.options.to);
    if (at === from) return;
    const order = [...rest.slice(0, at), moved, ...rest.slice(at)];
    const sizes = sheetSizes(draft.artwork);
    updateSheet(draft, sheet.id, (current) => arrangeSheet({ ...current, animationEntries: order }, sizes, draft.artwork.animations));
  },
});

export { sheetAnimationMove };
