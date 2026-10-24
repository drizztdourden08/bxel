/* @layer core @kind logic */
import { defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { checkColor } from './check-color';
import { importAppend } from './import-append';
import { importReplace } from './import-replace';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteImportSchema } from './palette-import-schema';

const paletteImport = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteImport,
  scope: 'none',
  schema: paletteImportSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.project, options.bankId as BankId);
    const colors = options.colors.map((value, at) => checkColor(value, `options.colors.${at}`));
    if (options.mode === 'append') importAppend(draft, bank, colors);
    else importReplace(draft, bank, colors);
  },
});

export { paletteImport };
