/* @layer core @kind logic */
import { defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { sortOrder } from '../sort-order';
import { bankSprites } from './bank-sprites';
import { bankUsage } from './bank-usage';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteSortSchema } from './palette-sort-schema';
import { reorderBank } from './reorder-bank';

const paletteSort = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteSort,
  scope: 'none',
  schema: paletteSortSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.artwork, options.bankId as BankId);
    const usage = bankUsage(bankSprites(draft.artwork, bank.id));
    const order = sortOrder(bank, { key: options.key, direction: options.direction ?? 'ascending', usage, ...(options.swatches ? { swatches: options.swatches } : {}) });
    reorderBank(draft, bank, order);
  },
});

export { paletteSort };
