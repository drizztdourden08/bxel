/* @layer core @kind logic */
import { defineCommand, registerRef, updateArtwork } from '@bxel/document';
import { buildNewBank } from './build-new-bank';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteColors } from './palette-colors';
import { paletteCreateSchema } from './palette-create-schema';
import { warnDuplicates } from './warn-duplicates';

const paletteCreate = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteCreate,
  scope: 'none',
  schema: paletteCreateSchema,
  run: (draft, input) => {
    const bank = buildNewBank(draft.ids, input.options);
    warnDuplicates(draft, bank.name, paletteColors(bank));
    updateArtwork(draft, (artwork) => ({ ...artwork, banks: [...artwork.banks, bank] }));
    registerRef(draft, input.ref, bank.id);
  },
});

export { paletteCreate };
