/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import type { SheetAnimationEntry } from '../../model/sheet.type';
import { sheetAnimationMoveSchema } from '../../schema/sheet-animation-move-schema';
import { arrangeSheet } from '../../sheet/arrange-sheet';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { pickAnimTag } from '../animation/pick-anim-tag';
import { pickAnimation } from '../animation/pick-animation';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickSheet } from './pick-sheet';

const sheetAnimationMove = defineCommand({
  name: COMMAND_NAME.sheetAnimationMove,
  scope: 'none',
  schema: sheetAnimationMoveSchema,
  run: (draft, input) => {
    const sheet = pickSheet(draft, input.options.sheet);
    const animation = pickAnimation(draft, input.options.animation);
    const ref = input.options.tag;
    const tagId = ref === undefined || ref === null ? ref : pickAnimTag(animation, ref, 'options.tag').id;
    const hit = (entry: SheetAnimationEntry): boolean => entry.animationId === animation.id && (tagId === undefined || entry.tagId === tagId);
    const entries = sheet.animationEntries ?? [];
    const from = entries.findIndex(hit);
    const moved = entries[from];
    if (!moved) {
      throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Animation "${animation.name}" is not on sheet "${sheet.name}".`, { path: 'options.animation' });
    }
    const rest = entries.filter((_entry, index) => index !== from);
    const at = Math.min(rest.length, input.options.to);
    if (at === from) return;
    const order = [...rest.slice(0, at), moved, ...rest.slice(at)];
    const sizes = sheetSizes(draft.artwork);
    updateSheet(draft, sheet.id, (current) => arrangeSheet({ ...current, animationEntries: order }, sizes, draft.artwork.animations));
  },
});

export { sheetAnimationMove };
