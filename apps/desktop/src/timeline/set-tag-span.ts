/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { TagId } from '@bxel/document';
import { changeTag } from './change-tag';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { spanTagOf } from './span-tag-of';
import { tagById } from './tag-by-id';
import { TIMELINE_LABEL } from './timeline.constants';
import { TIMELINE_SAY } from './timeline-say.constants';

const setTagSpan = (tagId: TagId, start: number, end: number): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const tag = spanTagOf(focus.animation, tagById(focus.animation, tagId));
  const { frames } = focus.animation;
  const from = frames[Math.max(0, Math.min(start, end))];
  const to = frames[Math.min(frames.length - 1, Math.max(start, end))];
  if (!tag || !from || !to || (tag.from === from.id && tag.to === to.id)) return false;
  if (!changeTag(TIMELINE_LABEL.tagRange, tag.id, { from: idRef(from.id), to: idRef(to.id) })) return false;
  announce(TIMELINE_SAY.tagResized(tag.name, frames.indexOf(from) + 1, frames.indexOf(to) + 1));
  return true;
};

export { setTagSpan };
