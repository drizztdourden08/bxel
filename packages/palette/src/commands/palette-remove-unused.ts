/* @layer core @kind logic */
import { defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteRemoveUnusedSchema } from './palette-remove-unused-schema';
import { removeSwatches } from './remove-swatches';
import { unusedSwatches } from './unused-swatches';

const paletteRemoveUnused = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteRemoveUnused,
  scope: 'none',
  schema: paletteRemoveUnusedSchema,
  run: (draft, input) => {
    const bankId = input.options.bankId as BankId;
    const bank = requireBank(draft.artwork, bankId);
    const unused = unusedSwatches(draft.artwork, bank, input.options.swatches);
    removeSwatches(draft, bankId, unused.map((from) => ({ from, into: null })));
  },
});

export { paletteRemoveUnused };
