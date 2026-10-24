/* @layer core @kind logic */
import { defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { findRamp } from './find-ramp';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { rampDeleteSchema } from './ramp-delete-schema';
import { updateBank } from './update-bank';

const rampDelete = defineCommand({
  name: PALETTE_COMMAND_NAME.rampDelete,
  scope: 'none',
  schema: rampDeleteSchema,
  run: (draft, input) => {
    const bank = requireBank(draft.project, input.options.bankId as BankId);
    const ramp = findRamp(bank, input.options.rampId);
    updateBank(draft, bank.id, (current) => ({ ...current, ramps: current.ramps.filter((item) => item.id !== ramp.id) }));
  },
});

export { rampDelete };
