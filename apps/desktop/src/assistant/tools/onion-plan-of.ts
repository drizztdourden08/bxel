/* @layer renderer-app @kind logic */
import type { AnimFrameId, Animation } from '@bxel/document';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { currentFocus } from '../../timeline/current-focus';
import { onionPlan } from '../../timeline/onion-plan';
import { playPlan } from '../../timeline/play-plan';
import type { OnionLayer } from '../../timeline/onion.type';

const onionPlanOf = (animation: Animation, frameId: AnimFrameId): OnionLayer[] => {
  const state = useTimelineStore.getState();
  const live = currentFocus()?.animation.id === animation.id;
  const mode = state.playMode;
  const plan = playPlan({
    animation,
    tagId: live ? state.tagId : null,
    picked: live ? state.selection.frames : [],
    rangePicked: live && state.rangePicked,
    loopRange: live ? state.loopRange : null,
    mode,
    subtags: state.subtags,
  });
  return onionPlan(animation, frameId, plan, { onion: { ...state.onion, on: true }, mode });
};

export { onionPlanOf };
