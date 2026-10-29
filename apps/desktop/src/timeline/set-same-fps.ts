/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { setDurationOf } from './set-duration-of';

const setSameFps = (fps: number, whole: boolean): boolean => {
  const focus = currentFocus();
  if (!focus || !Number.isFinite(fps) || fps <= 0) return false;
  const ids = whole ? focus.animation.frames.map((frame) => frame.id) : currentSelection(focus);
  return setDurationOf(ids, 1000 / fps);
};

export { setSameFps };
