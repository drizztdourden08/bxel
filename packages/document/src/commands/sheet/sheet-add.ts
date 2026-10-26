/* @layer core @kind logic */
import { addSheetEntry } from '../../draft/add-sheet-entry';
import { hasSheetEntry } from '../../draft/has-sheet-entry';
import { requireSheet } from '../../read/require-sheet';
import { requireSprite } from '../../read/require-sprite';
import { sheetAddSchema } from '../../schema/sheet-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickSheet } from './pick-sheet';
import { warnOverlaps } from './warn-overlaps';

const sheetAdd = defineCommand({
  name: COMMAND_NAME.sheetAdd,
  scope: 'sprites',
  schema: sheetAddSchema,
  run: (draft, input) => {
    const { places } = input.options;
    const sheet = pickSheet(draft, input.options.sheet);
    if (places && places.length !== input.sprites.length) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'Give one place for each target sprite.', { path: 'options.places' });
    }
    for (const [index, spriteId] of input.sprites.entries()) {
      const sprite = requireSprite(draft.artwork, spriteId);
      if (sprite.role !== 'sprite') throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" belongs to a tileset or an animation and cannot be on a sheet.`);
      if (hasSheetEntry(requireSheet(draft.artwork, sheet.id), spriteId)) {
        throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" is already on sheet "${sheet.name}".`);
      }
      addSheetEntry(draft, sheet.id, spriteId, places?.[index] ?? {});
    }
    warnOverlaps(draft, sheet.id);
  },
});

export { sheetAdd };
