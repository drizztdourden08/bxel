/* @layer core @kind logic */
import { defineCommand, ERROR_CODE, fail, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { bankSprites } from './bank-sprites';
import { bankUsage } from './bank-usage';
import { checkRemovable } from './check-removable';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { removeSwatch } from './remove-swatch';
import { replacementIndex } from './replacement-index';
import { slotIndex } from './slot-index';
import { swatchDeleteSchema } from './swatch-delete-schema';

const swatchDelete = defineCommand({
  name: PALETTE_COMMAND_NAME.swatchDelete,
  scope: 'none',
  schema: swatchDeleteSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.project, options.bankId as BankId);
    const removed = slotIndex(bank, options.swatchId, 'options.swatchId');
    checkRemovable(bank, removed, 'options.swatchId');
    const replacement =
      options.replacementId === undefined ? null : replacementIndex(bank, options.replacementId, removed, 'options.replacementId');
    const used = bankUsage(bankSprites(draft.project, bank.id))[removed] ?? 0;
    if (replacement === null && used > 0) {
      throw fail(ERROR_CODE.SWATCH_IN_USE, `${used} pixels use this swatch. Choose a replacement swatch first.`, {
        path: 'options.replacementId',
      });
    }
    removeSwatch(draft, { bank, removed, replacement: replacement ?? 0, substitute: null });
  },
});

export { swatchDelete };
