/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import type { SheetAnimationEntry } from '../../model/sheet.type';
import { sheetAnimationPlaceSchema } from '../../schema/sheet-animation-place-schema';
import { pickAnimTag } from '../animation/pick-anim-tag';
import { pickAnimation } from '../animation/pick-animation';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickSheet } from './pick-sheet';
import { warnOverlaps } from './warn-overlaps';

const sheetAnimationPlace = defineCommand({
  name: COMMAND_NAME.sheetAnimationPlace,
  scope: 'none',
  schema: sheetAnimationPlaceSchema,
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
    const { at } = input.options;
    const next = entries.map((entry) => (hit(entry) ? { ...entry, at } : entry));
    updateSheet(draft, sheet.id, (current) => ({ ...current, layout: { kind: 'manual' }, animationEntries: next }));
    warnOverlaps(draft, sheet.id);
  },
});

export { sheetAnimationPlace };
