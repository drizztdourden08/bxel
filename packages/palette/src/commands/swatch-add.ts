/* @layer core @kind logic */
import { addWarning, checkName, COMMAND_NAME, defineCommand, ERROR_CODE, fail, registerRef, requireBank } from '@bxel/document';
import type { BankId, SwatchId } from '@bxel/document';
import { checkColor } from './check-color';
import { WARNING_CODE } from './palette-warning.constants';
import { swatchAddSchema } from './swatch-add-schema';
import { updateBank } from './update-bank';

const swatchAdd = defineCommand({
  name: COMMAND_NAME.swatchAdd,
  scope: 'none',
  schema: swatchAddSchema,
  run: (draft, input) => {
    const { options } = input;
    const bankId = options.bankId as BankId;
    const bank = requireBank(draft.artwork, bankId);
    const rgb = checkColor(options.rgb, 'options.rgb');
    const name = options.name === undefined ? rgb : checkName(options.name);
    if (bank.slots.length >= bank.cap) {
      throw fail(ERROR_CODE.PALETTE_FULL, `Bank "${bank.name}" already holds its ${bank.cap} slots.`, { path: 'options.bankId' });
    }
    if (bank.slots.some((slot) => slot.kind === 'color' && slot.rgb === rgb)) {
      addWarning(draft, WARNING_CODE.DUPLICATE_COLOR, `${rgb} is already in bank "${bank.name}".`);
    }
    const id = draft.ids.next('sw') as SwatchId;
    updateBank(draft, bankId, (current) => ({ ...current, slots: [...current.slots, { id, kind: 'color', rgb, name }] }));
    registerRef(draft, input.ref, id);
  },
});

export { swatchAdd };
