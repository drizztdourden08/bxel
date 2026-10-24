/* @layer core @kind logic */
import { defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteUpdateSchema } from './palette-update-schema';
import { renameBank } from './rename-bank';
import { transparencyOff } from './transparency-off';
import { transparencyOn } from './transparency-on';

const paletteUpdate = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteUpdate,
  scope: 'none',
  schema: paletteUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.artwork, options.bankId as BankId);
    if (options.name !== undefined) renameBank(draft, bank, options.name);
    if (options.transparent === undefined || options.transparent === bank.transparent) return;
    if (options.transparent) transparencyOn(draft, bank, options.fillBackground ?? false);
    else transparencyOff(draft, bank, options.replacementId);
  },
});

export { paletteUpdate };
