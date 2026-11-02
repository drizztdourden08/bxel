/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { TagId } from '@bxel/document';
import { changeTag } from './change-tag';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';
import { spanTagOf } from './span-tag-of';
import { tagById } from './tag-by-id';
import { TIMELINE_SAY } from './timeline-say.constants';

const setTagRange = (tagId: TagId): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const picked = currentSelection(focus);
  const [from] = picked;
  const to = picked.at(-1);
  if (from === undefined || to === undefined) return false;
  if (!changeTag(TIMELINE_LABEL.updateTag, tagId, { from: idRef(from), to: idRef(to) })) return false;
  const order = focus.animation.frames.map((frame) => frame.id);
  const name = spanTagOf(focus.animation, tagById(focus.animation, tagId))?.name ?? '';
  announce(TIMELINE_SAY.tagResized(name, order.indexOf(from) + 1, order.indexOf(to) + 1));
  return true;
};

export { setTagRange };
