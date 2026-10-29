/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { spanTagOf } from './span-tag-of';
import { tagById } from './tag-by-id';

const tagBounds = (tagId: TagId): { start: number; end: number; low: number; high: number } | null => {
  const focus = currentFocus();
  const tag = focus ? spanTagOf(focus.animation, tagById(focus.animation, tagId)) : undefined;
  if (!focus || !tag) return null;
  const order = focus.animation.frames.map((frame) => frame.id);
  const indices = currentSelection(focus).map((id) => order.indexOf(id));
  return { start: order.indexOf(tag.from), end: order.indexOf(tag.to), low: Math.min(...indices), high: Math.max(...indices) };
};

export { tagBounds };
