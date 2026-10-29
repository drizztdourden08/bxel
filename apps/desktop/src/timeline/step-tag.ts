/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import { goToFrame } from './go-to-frame';
import { spanTagOf } from './span-tag-of';

const stepTag = (direction: 1 | -1): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const order = focus.animation.frames.map((frame) => frame.id);
  const here = order.indexOf(focus.frame.id);
  const starts = [...new Set(focus.animation.tags.flatMap((tag) => {
    const from = spanTagOf(focus.animation, tag)?.from;
    return from === undefined ? [] : [order.indexOf(from)];
  }))]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b);
  const target = direction === 1 ? starts.find((index) => index > here) : [...starts].reverse().find((index) => index < here);
  const id = target === undefined ? undefined : order[target];
  if (id === undefined) return false;
  goToFrame(id);
  return true;
};

export { stepTag };
