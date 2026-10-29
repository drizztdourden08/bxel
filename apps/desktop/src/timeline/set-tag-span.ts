/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { changeTag } from './change-tag';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { spanTagOf } from './span-tag-of';
import { tagById } from './tag-by-id';
import { TIMELINE_LABEL } from './timeline.constants';

const setTagSpan = (tagId: TagId, start: number, end: number): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const tag = spanTagOf(focus.animation, tagById(focus.animation, tagId));
  const { frames } = focus.animation;
  const from = frames[Math.max(0, Math.min(start, end))];
  const to = frames[Math.min(frames.length - 1, Math.max(start, end))];
  if (!tag || !from || !to || (tag.from === from.id && tag.to === to.id)) return false;
  return changeTag(TIMELINE_LABEL.tagRange, tag.id, { from: idRef(from.id), to: idRef(to.id) });
};

export { setTagSpan };
