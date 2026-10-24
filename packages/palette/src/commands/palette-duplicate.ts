/* @layer core @kind logic */
import { assertNameFree, checkName, defineCommand, registerRef, requireBank, updateArtwork } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { copyBank } from './copy-bank';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteDuplicateSchema } from './palette-duplicate-schema';
import { uniqueBankName } from './unique-bank-name';

const paletteDuplicate = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteDuplicate,
  scope: 'none',
  schema: paletteDuplicateSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.artwork, options.bankId as BankId);
    const name = options.name === undefined ? uniqueBankName(draft.artwork, bank.name) : checkName(options.name);
    assertNameFree(
      draft.artwork.banks.map((other) => other.name),
      name,
    );
    const copy = copyBank(draft.ids, bank, name);
    updateArtwork(draft, (artwork) => ({ ...artwork, banks: [...artwork.banks, copy] }));
    registerRef(draft, input.ref, copy.id);
  },
});

export { paletteDuplicate };
