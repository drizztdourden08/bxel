/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import { sheetGuidesSchema } from '../../schema/sheet-guides-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { copyGuides } from '../guide/copy-guides';
import { pickSheet } from './pick-sheet';

const sheetGuides = defineCommand({
  name: COMMAND_NAME.sheetGuides,
  scope: 'none',
  schema: sheetGuidesSchema,
  run: (draft, input) => {
    const sheet = pickSheet(draft, input.options.sheet);
    updateSheet(draft, sheet.id, (current) => {
      const { guides: _old, ...rest } = current;
      const guides = copyGuides(input.options.guides);
      return guides ? { ...rest, guides } : rest;
    });
  },
});

export { sheetGuides };
