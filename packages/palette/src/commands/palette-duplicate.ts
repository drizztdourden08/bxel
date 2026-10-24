/* @layer core @kind logic */
import { defineCommand, registerRef, requireBank, updateArtwork } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { bankCopyName } from './bank-copy-name';
import { copyBank } from './copy-bank';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteDuplicateSchema } from './palette-duplicate-schema';

const paletteDuplicate = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteDuplicate,
  scope: 'none',
  schema: paletteDuplicateSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.artwork, options.bankId as BankId);
    const copy = copyBank(draft.ids, bank, bankCopyName(draft, bank, options.name));
    updateArtwork(draft, (artwork) => ({ ...artwork, banks: [...artwork.banks, copy] }));
    registerRef(draft, input.ref, copy.id);
  },
});

export { paletteDuplicate };
