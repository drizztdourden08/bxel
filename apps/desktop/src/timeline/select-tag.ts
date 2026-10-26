/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { selectFrameIds } from './select-frame-ids';
import { spanTagOf, tagById } from './span-tag-of';

const selectTag = (tagId: TagId): void => {
  const focus = currentFocus();
  if (!focus) return;
  const tag = spanTagOf(focus.animation, tagById(focus.animation, tagId));
  if (!tag) return;
  const order = focus.animation.frames.map((frame) => frame.id);
  const from = order.indexOf(tag.from);
  const to = order.indexOf(tag.to);
  useTimelineStore.getState().selectTag(tagId);
  if (from < 0 || to < 0) return;
  const frames = order.slice(Math.min(from, to), Math.max(from, to) + 1);
  selectFrameIds(frames, frames.includes(focus.frame.id) ? focus.frame.id : undefined);
};

export { selectTag };
