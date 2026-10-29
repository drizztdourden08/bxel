/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { currentFocus } from './current-focus';
import type { TagNudge } from './nudge-tag.type';
import { setTagSpan } from './set-tag-span';
import { spanTagOf } from './span-tag-of';
import { tagById } from './tag-by-id';

const nudgeTag = (tagId: TagId, how: TagNudge, delta: number): boolean => {
  const focus = currentFocus();
  const tag = focus ? spanTagOf(focus.animation, tagById(focus.animation, tagId)) : undefined;
  if (!focus || !tag) return false;
  const order = focus.animation.frames.map((frame) => frame.id);
  const from = order.indexOf(tag.from);
  const to = order.indexOf(tag.to);
  const last = order.length - 1;
  if (how === 'resize') return setTagSpan(tag.id, from, Math.min(last, Math.max(from, to + delta)));
  const shift = Math.max(-from, Math.min(delta, last - to));
  return setTagSpan(tag.id, from + shift, to + shift);
};

export { nudgeTag };
