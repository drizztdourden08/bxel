/* @layer core @kind logic */
import { defineCommand, ERROR_CODE, fail, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { findRamp } from './find-ramp';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { rampMoveSchema } from './ramp-move-schema';
import { updateBank } from './update-bank';

const rampMove = defineCommand({
  name: PALETTE_COMMAND_NAME.rampMove,
  scope: 'none',
  schema: rampMoveSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.artwork, options.bankId as BankId);
    const ramp = findRamp(bank, options.rampId);
    if (options.toIndex >= bank.ramps.length) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Index ${options.toIndex} is past the last of ${bank.ramps.length} ramps.`, { path: 'options.toIndex' });
    }
    if (bank.ramps.indexOf(ramp) === options.toIndex) return;
    updateBank(draft, bank.id, (current) => {
      const rest = current.ramps.filter((item) => item.id !== ramp.id);
      return { ...current, ramps: [...rest.slice(0, options.toIndex), ramp, ...rest.slice(options.toIndex)] };
    });
  },
});

export { rampMove };
