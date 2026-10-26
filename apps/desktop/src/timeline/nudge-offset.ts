/* @layer renderer-app @kind logic */
import { placedFocus } from './placed-focus';
import { setOffset } from './set-offset';

const nudgeOffset = (dx: number, dy: number): boolean => {
  const focus = placedFocus();
  return focus !== null && setOffset(focus.frame.offset.x + dx, focus.frame.offset.y + dy);
};

export { nudgeOffset };
