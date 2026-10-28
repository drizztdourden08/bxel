/* @layer core @kind logic */
import { assertNameFree, checkName, defineCommand, registerRef, requireBank } from '@bxel/document';
import type { BankId, RampId } from '@bxel/document';
import { checkRampSwatches } from './check-ramp-swatches';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { rampAddSchema } from './ramp-add-schema';
import { resolveSwatchRefs } from './resolve-swatch-refs';
import { updateBank } from './update-bank';

const rampAdd = defineCommand({
  name: PALETTE_COMMAND_NAME.rampAdd,
  scope: 'none',
  schema: rampAddSchema,
  run: (draft, input) => {
    const { options } = input;
    const bank = requireBank(draft.artwork, options.bankId as BankId);
    const name = checkName(options.name);
    assertNameFree(
      bank.ramps.map((ramp) => ramp.name),
      name,
    );
    const swatches = checkRampSwatches(bank, resolveSwatchRefs(draft, options.swatches, 'options.swatches'), 'options.swatches');
    const id = draft.ids.next('rmp') as RampId;
    updateBank(draft, bank.id, (current) => ({ ...current, ramps: [...current.ramps, { id, name, swatches }] }));
    registerRef(draft, input.ref, id);
  },
});

export { rampAdd };
