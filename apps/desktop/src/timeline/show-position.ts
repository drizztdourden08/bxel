/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { CLOCK } from './playback-clock.constants';
import type { PlayPlan, PlayPosition } from './play-plan.type';
import type { AnimationFocus } from './timeline.type';

const showPosition = (plan: PlayPlan, focus: AnimationFocus, position: PlayPosition): void => {
  const step = plan.steps[position.cursor];
  if (!step) return;
  CLOCK.shown = step.frameId;
  const state = useTimelineStore.getState();
  if (step.frameId !== focus.frame.id || state.cursor !== position.cursor) useTimelineStore.setState({ frameId: step.frameId, cursor: position.cursor });
};

export { showPosition };
