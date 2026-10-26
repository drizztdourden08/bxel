/* @layer core @kind logic */
import { addWarning, checkName, COMMAND_NAME, defineCommand, ERROR_CODE, fail, formatSwatchColor, registerRef, requireBank, swatchAlpha, swatchFields } from '@bxel/document';
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
    const parsed = checkColor(options.rgb, 'options.rgb');
    const alpha = options.alpha ?? parsed.alpha;
    const text = formatSwatchColor(parsed.rgb, alpha);
    const name = options.name === undefined ? text : checkName(options.name);
    if (bank.slots.length >= bank.cap) {
      throw fail(ERROR_CODE.PALETTE_FULL, `Bank "${bank.name}" already holds its ${bank.cap} slots.`, { path: 'options.bankId' });
    }
    if (bank.slots.some((slot) => slot.kind === 'color' && slot.rgb === parsed.rgb && swatchAlpha(slot) === alpha)) {
      addWarning(draft, WARNING_CODE.DUPLICATE_COLOR, `${text} is already in bank "${bank.name}".`);
    }
    const id = draft.ids.next('sw') as SwatchId;
    updateBank(draft, bankId, (current) => ({ ...current, slots: [...current.slots, { id, kind: 'color', ...swatchFields(parsed.rgb, alpha), name }] }));
    registerRef(draft, input.ref, id);
  },
});

export { swatchAdd };
