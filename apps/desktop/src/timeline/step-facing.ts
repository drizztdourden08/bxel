/* @layer renderer-app @kind logic */
import { FACING_SETS } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { facingTag } from './facing-tag';
import { pickFacing } from './pick-facing';
import { tagById } from './tag-by-id';
import { tagFacingOf } from './tag-facing-of';

const stepFacing = (direction: 1 | -1): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const facings = FACING_SETS[focus.animation.directions].filter((facing) => facingTag(focus.animation, facing) !== undefined);
  if (facings.length === 0) return false;
  const tag = tagById(focus.animation, useTimelineStore.getState().tagId);
  const current = tagFacingOf(focus.animation, tag);
  const at = current === undefined ? -1 : facings.indexOf(current);
  const next = facings[(at + direction + facings.length) % facings.length];
  return next !== undefined && pickFacing(next);
};

export { stepFacing };
