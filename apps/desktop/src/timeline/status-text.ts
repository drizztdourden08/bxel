/* @layer renderer-app @kind logic */
import { TIMELINE_TEXT } from './timeline.constants';
import type { AnimationFocus } from './timeline.type';

const statusText = (focus: AnimationFocus): string => {
  const { frames } = focus.animation;
  const at = frames.findIndex((frame) => frame.id === focus.frame.id);
  return TIMELINE_TEXT.status(at + 1, frames.length, focus.frame.durationMs);
};

export { statusText };
