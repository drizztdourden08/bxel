/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand, ERROR_CODE, fail, MAX_BANK_CAP, MIN_BANK_CAP, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { paletteResizeSchema } from './palette-resize-schema';
import { updateBank } from './update-bank';

const paletteResize = defineCommand({
  name: COMMAND_NAME.paletteResize,
  scope: 'none',
  schema: paletteResizeSchema,
  run: (draft, input) => {
    const { cap } = input.options;
    const bankId = input.options.bankId as BankId;
    const bank = requireBank(draft.artwork, bankId);
    if (cap < MIN_BANK_CAP || cap > MAX_BANK_CAP) {
      throw fail(ERROR_CODE.CAP_OUT_OF_RANGE, `A bank holds ${MIN_BANK_CAP} to ${MAX_BANK_CAP} slots.`, { path: 'options.cap' });
    }
    if (cap < bank.slots.length) {
      throw fail(ERROR_CODE.CAP_BELOW_USED, `Bank "${bank.name}" already holds ${bank.slots.length} slots.`, { path: 'options.cap' });
    }
    if (cap === bank.cap) return;
    updateBank(draft, bankId, (current) => ({ ...current, cap }));
  },
});

export { paletteResize };
