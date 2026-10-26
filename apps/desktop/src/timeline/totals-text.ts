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

export { totalsText };
