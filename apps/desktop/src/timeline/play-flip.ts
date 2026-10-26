/* @layer renderer-app @kind logic */
import type { AnimFlip } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { playSteps } from './play-steps';
import type { AnimationFocus } from './timeline.type';

const playFlip = (focus: AnimationFocus): AnimFlip | null => {
  const { tagId, cursor } = useTimelineStore.getState();
  const step = playSteps(focus.animation, tagId).steps[cursor];
  return step?.frameId === focus.frame.id ? step.flip : null;
};

export { playFlip };
