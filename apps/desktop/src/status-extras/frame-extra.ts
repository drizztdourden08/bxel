/* @layer renderer-app @kind logic */
import type { AnimationFocus } from '../timeline/timeline.type';
import { EXTRA_TEXT } from './status-extras.constants';

const frameExtra = (focus: AnimationFocus | null): string | null => {
  if (!focus) return null;
  const at = focus.animation.frames.findIndex((each) => each.id === focus.frame.id) + 1;
  return EXTRA_TEXT.frameValue(at, focus.animation.frames.length, focus.frame.durationMs);
};

export { frameExtra };
