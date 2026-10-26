/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import { arrangeSheet } from '../../sheet/arrange-sheet';
import type { SheetAnimationEntry } from '../../model/sheet.type';
import { sheetAnimationRemoveSchema } from '../../schema/sheet-animation-remove-schema';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { pickAnimTag } from '../animation/pick-anim-tag';
import { pickAnimation } from '../animation/pick-animation';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickSheet } from './pick-sheet';

const sheetAnimationRemove = defineCommand({
  name: COMMAND_NAME.sheetAnimationRemove,
  scope: 'none',
  schema: sheetAnimationRemoveSchema,
  run: (draft, input) => {
    const sheet = pickSheet(draft, input.options.sheet);
    const animation = pickAnimation(draft, input.options.animation);
    const ref = input.options.tag;
    const tagId = ref === undefined || ref === null ? ref : pickAnimTag(animation, ref, 'options.tag').id;
    const hit = (entry: SheetAnimationEntry): boolean => entry.animationId === animation.id && (tagId === undefined || entry.tagId === tagId);
    const entries = sheet.animationEntries ?? [];
    if (!entries.some(hit)) {
      throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Animation "${animation.name}" is not on sheet "${sheet.name}".`, { path: 'options.animation' });
    }
    const sizes = sheetSizes(draft.artwork);
    updateSheet(draft, sheet.id, (current) => arrangeSheet({ ...current, animationEntries: entries.filter((entry) => !hit(entry)) }, sizes, draft.artwork.animations));
  },
});

export { sheetAnimationRemove };
