/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { setTagSpan } from './set-tag-span';
import { spanTagOf } from './span-tag-of';
import { tagById } from './tag-by-id';

const bounds = (tagId: TagId): { start: number; end: number; low: number; high: number } | null => {
  const focus = currentFocus();
  const tag = focus ? spanTagOf(focus.animation, tagById(focus.animation, tagId)) : undefined;
  if (!focus || !tag) return null;
  const order = focus.animation.frames.map((frame) => frame.id);
  const indices = currentSelection(focus).map((id) => order.indexOf(id));
  return { start: order.indexOf(tag.from), end: order.indexOf(tag.to), low: Math.min(...indices), high: Math.max(...indices) };
};

const includeInTag = (tagId: TagId): boolean => {
  const range = bounds(tagId);
  return range !== null && setTagSpan(tagId, Math.min(range.start, range.low), Math.max(range.end, range.high));
};

const excludeFromTag = (tagId: TagId): boolean => {
  const range = bounds(tagId);
  if (range === null) return false;
  if (range.low <= range.start && range.high < range.end) return setTagSpan(tagId, range.high + 1, range.end);
  if (range.high >= range.end && range.low > range.start) return setTagSpan(tagId, range.start, range.low - 1);
  return false;
};

export { excludeFromTag, includeInTag };
