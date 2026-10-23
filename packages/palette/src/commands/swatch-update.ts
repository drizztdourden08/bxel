/* @layer core @kind logic */
import { checkName, COMMAND_NAME, defineCommand, ERROR_CODE, fail, requireBank } from '@bxel/document';
import type { BankId, SwatchId } from '@bxel/document';
import { checkColor } from './check-color';
import { swatchUpdateSchema } from './swatch-update-schema';
import { updateBank } from './update-bank';

const swatchUpdate = defineCommand({
  name: COMMAND_NAME.swatchUpdate,
  scope: 'none',
  schema: swatchUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const bankId = options.bankId as BankId;
    const swatchId = options.swatchId as SwatchId;
    const slot = requireBank(draft.project, bankId).slots.find((candidate) => candidate.id === swatchId);
    if (!slot) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Swatch ${swatchId} is not in bank ${bankId}.`, { path: 'options.swatchId' });
    if (slot.kind === 'transparent') {
      throw fail(ERROR_CODE.TRANSPARENT_SLOT_FIXED, 'The transparent swatch cannot be edited.', { path: 'options.swatchId' });
    }
    const rgb = options.rgb === undefined ? slot.rgb : checkColor(options.rgb, 'options.rgb');
    const name = options.name === undefined ? slot.name : checkName(options.name);
    if (rgb === slot.rgb && name === slot.name) return;
    updateBank(draft, bankId, (current) => ({
      ...current,
      slots: current.slots.map((candidate) => (candidate.id === swatchId ? { ...slot, rgb, name } : candidate)),
    }));
  },
});

export { swatchUpdate };
