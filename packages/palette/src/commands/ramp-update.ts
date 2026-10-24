/* @layer core @kind logic */
import { assertNameFree, checkName, defineCommand, requireBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { checkRampSwatches } from './check-ramp-swatches';
import { findRamp } from './find-ramp';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { rampUpdateSchema } from './ramp-update-schema';
import { updateBank } from './update-bank';

const rampUpdate = defineCommand({
  name: PALETTE_COMMAND_NAME.rampUpdate,
  scope: 'none',
  schema: rampUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.project, options.bankId as BankId);
    const ramp = findRamp(bank, options.rampId);
    const name = options.name === undefined ? ramp.name : checkName(options.name);
    assertNameFree(
      bank.ramps.filter((other) => other.id !== ramp.id).map((other) => other.name),
      name,
    );
    const swatches = options.swatches === undefined ? ramp.swatches : checkRampSwatches(bank, options.swatches, 'options.swatches');
    if (name === ramp.name && swatches === ramp.swatches) return;
    updateBank(draft, bank.id, (current) => ({
      ...current,
      ramps: current.ramps.map((item) => (item.id === ramp.id ? { ...item, name, swatches } : item)),
    }));
  },
});

export { rampUpdate };
