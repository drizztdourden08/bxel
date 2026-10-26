/* @layer renderer-app @kind logic */
import { clampIndex } from './clamp-index';
import { currentFocus } from './current-focus';
import { goToFrame } from './go-to-frame';

const stepFrame = (delta: number, extend = false): void => {
  const focus = currentFocus();
  if (!focus) return;
  const { frames } = focus.animation;
  const next = frames[clampIndex(frames.findIndex((frame) => frame.id === focus.frame.id) + delta, frames.length)];
  if (next) goToFrame(next.id, extend);
};

export { stepFrame };
