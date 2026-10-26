/* @layer renderer-app @kind logic */
import type { AnimationFocus } from './timeline.type';

const insertAt = (focus: AnimationFocus): number => focus.animation.frames.findIndex((frame) => frame.id === focus.frame.id) + 1;

export { insertAt };
