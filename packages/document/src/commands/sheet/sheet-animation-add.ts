/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import { arrangeSheet } from '../../sheet/arrange-sheet';
import type { Point } from '../../model/geometry.type';
import type { Sheet } from '../../model/sheet.type';
import type { Artwork } from '../../model/artwork.type';
import { sheetAnimationAddSchema } from '../../schema/sheet-animation-add-schema';
import { sheetExtent } from '../../sheet/sheet-extent';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { pickAnimTag } from '../animation/pick-anim-tag';
import { pickAnimation } from '../animation/pick-animation';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickSheet } from './pick-sheet';
import { warnOverlaps } from './warn-overlaps';

const belowContent = (artwork: Artwork, sheet: Sheet): Point => {
  const extent = sheetExtent(sheet, sheetSizes(artwork), artwork.animations);
  const empty = extent.height <= sheet.margin;
  return { x: sheet.margin, y: empty ? sheet.margin : extent.height - sheet.margin + sheet.spacing.y };
};

const sheetAnimationAdd = defineCommand({
  name: COMMAND_NAME.sheetAnimationAdd,
  scope: 'none',
  schema: sheetAnimationAddSchema,
  run: (draft, input) => {
    const sheet = pickSheet(draft, input.options.sheet);
    const animation = pickAnimation(draft, input.options.animation);
    const tag = input.options.tag === null ? null : pickAnimTag(animation, input.options.tag, 'options.tag');
    const tagId = tag?.id ?? null;
    const placed = (sheet.animationEntries ?? []).some((entry) => entry.animationId === animation.id && entry.tagId === tagId);
    if (placed) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Animation "${animation.name}" is already on sheet "${sheet.name}" that way.`, { path: 'options.animation' });
    }
    const at = input.options.at ?? belowContent(draft.artwork, sheet);
    const sizes = sheetSizes(draft.artwork);
    updateSheet(draft, sheet.id, (current) => {
      const grown = { ...current, animationEntries: [...(current.animationEntries ?? []), { animationId: animation.id, tagId, at }] };
      return input.options.at ? grown : arrangeSheet(grown, sizes, draft.artwork.animations);
    });
    warnOverlaps(draft, sheet.id);
  },
});

export { sheetAnimationAdd };
