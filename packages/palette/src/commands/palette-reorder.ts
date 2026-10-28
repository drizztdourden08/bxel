/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { paletteReorderSchema } from './palette-reorder-schema';
import { reorderBank } from './reorder-bank';

const paletteReorder = defineCommand({
  name: COMMAND_NAME.paletteReorder,
  scope: 'none',
  schema: paletteReorderSchema,
  run: (draft, input) => {
    const bank = requireBank(draft.artwork, input.options.bankId as BankId);
    reorderBank(draft, bank, input.options.order);
  },
});

export { paletteReorder };
