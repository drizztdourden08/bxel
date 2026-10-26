/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { fpsOf } from './fps-of';
import { playSteps } from './play-steps';
import { TIMELINE_TEXT } from './timeline.constants';
import type { AnimationFocus } from './timeline.type';

const totalsText = (focus: AnimationFocus, tagId: TagId | null): string => {
  const sequence = playSteps(focus.animation, tagId);
  return TIMELINE_TEXT.total(sequence.steps.length, sequence.cycleMs, TIMELINE_TEXT.fps(fpsOf(sequence)));
};

const statusText = (focus: AnimationFocus): string => {
  const { frames } = focus.animation;
  const at = frames.findIndex((frame) => frame.id === focus.frame.id);
  return TIMELINE_TEXT.status(at + 1, frames.length, focus.frame.durationMs);
};

export { statusText, totalsText };
