/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import { sheetUpdateSchema } from '../../schema/sheet-update-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickSheet } from './pick-sheet';
import { restyleSheet } from './restyle-sheet';

const sheetUpdate = defineCommand({
  name: COMMAND_NAME.sheetUpdate,
  scope: 'none',
  schema: sheetUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const sheet = pickSheet(draft, options.sheet);
    if (options.name !== undefined) {
      const name = checkName(options.name);
      assertNameFree(
        draft.artwork.sheets.filter((other) => other.id !== sheet.id).map((other) => other.name),
        name,
      );
      if (name !== sheet.name) updateSheet(draft, sheet.id, (current) => ({ ...current, name }));
    }
    const { layout, spacing, margin } = options;
    if (layout || spacing || margin !== undefined) {
      restyleSheet(draft, pickSheet(draft, sheet.id), { layout, spacing, margin });
    }
  },
});

export { sheetUpdate };
