/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import { setDurationOf } from './set-duration-of';

const setDurationOfIds = (frameIds: readonly string[], durationMs: number): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const known = new Set(frameIds);
  const ids = focus.animation.frames.filter((frame) => known.has(frame.id)).map((frame) => frame.id);
  return ids.length > 0 && setDurationOf(ids, durationMs);
};

export { setDurationOfIds };
