/* @layer renderer-app @kind logic */
import type { AnimFlip } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentPlan } from './current-plan';
import type { AnimationFocus } from './timeline.type';

const playFlip = (focus: AnimationFocus): AnimFlip | null => {
  const step = currentPlan(focus).steps[useTimelineStore.getState().cursor];
  return step?.frameId === focus.frame.id ? step.flip : null;
};

export { playFlip };
