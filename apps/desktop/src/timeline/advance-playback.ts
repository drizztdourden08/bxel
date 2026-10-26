/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { nextCursor } from './next-cursor';
import { playSteps } from './play-steps';

const advancePlayback = (): boolean => {
  const focus = currentFocus();
  const state = useTimelineStore.getState();
  if (!focus) {
    state.pause();
    return false;
  }
  const { steps } = playSteps(focus.animation, state.tagId);
  const at = steps[state.cursor]?.frameId === focus.frame.id ? state.cursor : Math.max(0, steps.findIndex((step) => step.frameId === focus.frame.id));
  const next = nextCursor(steps.length, at, state.loop);
  const frameId = next === null ? undefined : steps[next]?.frameId;
  if (next === null || frameId === undefined) {
    state.pause();
    return false;
  }
  useTimelineStore.setState({ frameId, cursor: next });
  return true;
};

export { advancePlayback };
