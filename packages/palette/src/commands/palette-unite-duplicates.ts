/* @layer core @kind logic */
import { defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { duplicateFolds } from './duplicate-folds';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteUniteDuplicatesSchema } from './palette-unite-duplicates-schema';
import { removeSwatches } from './remove-swatches';

const paletteUniteDuplicates = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteUniteDuplicates,
  scope: 'none',
  schema: paletteUniteDuplicatesSchema,
  run: (draft, input) => {
    const bankId = input.options.bankId as BankId;
    removeSwatches(draft, bankId, duplicateFolds(requireBank(draft.artwork, bankId)));
  },
});

export { paletteUniteDuplicates };
