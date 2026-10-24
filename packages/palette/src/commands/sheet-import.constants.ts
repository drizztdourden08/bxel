/* @layer core @kind config */
import { COMMAND_NAME, MAX_TARGET_SPRITES } from '@bxel/document';

const SHEET_IMPORT_REF = 'sheet-import';

const SHEET_IMPORT_ADD_CHUNK = MAX_TARGET_SPRITES;

const SHEET_IMPORT_STEPS = {
  create: COMMAND_NAME.sheetCreate,
  add: COMMAND_NAME.sheetAdd,
} as const;

export { SHEET_IMPORT_ADD_CHUNK, SHEET_IMPORT_REF, SHEET_IMPORT_STEPS };
