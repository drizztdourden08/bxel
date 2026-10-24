/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import { sheetDeleteSchema } from '../../schema/sheet-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickSheet } from './pick-sheet';

const sheetDelete = defineCommand({
  name: COMMAND_NAME.sheetDelete,
  scope: 'none',
  schema: sheetDeleteSchema,
  run: (draft, input) => {
    const sheet = pickSheet(draft, input.options.sheet);
    if (draft.artwork.presets.some((preset) => preset.sheetId === sheet.id)) {
      throw fail(ERROR_CODE.SHEET_IN_USE, `Sheet "${sheet.name}" is used by an export preset.`, { path: 'options.sheet' });
    }
    updateArtwork(draft, (artwork) => ({ ...artwork, sheets: artwork.sheets.filter((item) => item.id !== sheet.id) }));
  },
});

export { sheetDelete };
