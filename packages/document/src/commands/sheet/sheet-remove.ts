/* @layer core @kind logic */
import type { TargetIssue } from '../command-error.type';
import { updateSheet } from '../../draft/update-sheet';
import { hasSheetEntry } from '../../draft/has-sheet-entry';
import { arrangeSheet } from '../../sheet/arrange-sheet';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { sheetRemoveSchema } from '../../schema/sheet-remove-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickSheet } from './pick-sheet';

const sheetRemove = defineCommand({
  name: COMMAND_NAME.sheetRemove,
  scope: 'sprites',
  schema: sheetRemoveSchema,
  run: (draft, input) => {
    const sheet = pickSheet(draft, input.options.sheet);
    const missing: TargetIssue[] = input.sprites
      .filter((spriteId) => !hasSheetEntry(sheet, spriteId))
      .map((spriteId) => ({ spriteId, layerId: null, frameId: null, reason: 'the sprite is not on the sheet' }));
    if (missing.length > 0) {
      throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Some target sprites are not on sheet "${sheet.name}".`, { details: missing });
    }
    const gone = new Set(input.sprites);
    const sizes = sheetSizes(draft.artwork);
    updateSheet(draft, sheet.id, (current) =>
      arrangeSheet({ ...current, entries: current.entries.filter((entry) => !gone.has(entry.spriteId)) }, sizes),
    );
  },
});

export { sheetRemove };
