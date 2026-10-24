/* @layer core @kind logic */
import { defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { checkRemovable } from './check-removable';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { removeSwatch } from './remove-swatch';
import { replacementIndex } from './replacement-index';
import { slotIndex } from './slot-index';
import { swatchMergeSchema } from './swatch-merge-schema';

const swatchMerge = defineCommand({
  name: PALETTE_COMMAND_NAME.swatchMerge,
  scope: 'none',
  schema: swatchMergeSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.artwork, options.bankId as BankId);
    const removed = slotIndex(bank, options.from, 'options.from');
    checkRemovable(bank, removed, 'options.from');
    const replacement = replacementIndex(bank, options.into, removed, 'options.into');
    const target = bank.slots[replacement];
    removeSwatch(draft, { bank, removed, replacement, substitute: target?.kind === 'color' ? target.id : null });
  },
});

export { swatchMerge };
