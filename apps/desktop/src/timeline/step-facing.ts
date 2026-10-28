/* @layer renderer-app @kind logic */
import { FACING_SETS } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { facingTag } from './facing-tag';
import { pickFacing } from './pick-facing';
import { tagById } from './tag-by-id';
import { spanTagOf } from './span-tag-of';

const stepFacing = (direction: 1 | -1): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const facings = FACING_SETS[focus.animation.directions].filter((facing) => facingTag(focus.animation, facing) !== undefined);
  if (facings.length === 0) return false;
  const tag = tagById(focus.animation, useTimelineStore.getState().tagId);
  const current = tag === undefined ? undefined : tag.kind === 'mirror' ? tag.facing : spanTagOf(focus.animation, tag)?.facing;
  const at = current === undefined ? -1 : facings.indexOf(current);
  const next = facings[(at + direction + facings.length) % facings.length];
  return next !== undefined && pickFacing(next);
};

export { stepFacing };
