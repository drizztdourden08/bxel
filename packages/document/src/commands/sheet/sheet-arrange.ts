/* @layer core @kind logic */
import { sheetArrangeSchema } from '../../schema/sheet-arrange-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickSheet } from './pick-sheet';
import { restyleSheet } from './restyle-sheet';

const sheetArrange = defineCommand({
  name: COMMAND_NAME.sheetArrange,
  scope: 'none',
  schema: sheetArrangeSchema,
  run: (draft, input) => {
    const { options } = input;
    restyleSheet(draft, pickSheet(draft, options.sheet), {
      layout: options.layout,
      spacing: options.spacing,
      margin: options.margin,
    });
  },
});

export { sheetArrange };
