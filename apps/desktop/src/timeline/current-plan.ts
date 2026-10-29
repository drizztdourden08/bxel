/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentSelection } from './current-selection';
import { playPlan } from './play-plan';
import type { PlayPlan } from './play-plan.type';
import type { AnimationFocus } from './timeline.type';

const currentPlan = (focus: AnimationFocus): PlayPlan => {
  const state = useTimelineStore.getState();
  return playPlan({
    animation: focus.animation,
    tagId: state.tagId,
    picked: currentSelection(focus),
    rangePicked: state.rangePicked,
    loopRange: state.loopRange,
    mode: state.playOnce ? 'once' : state.playMode,
    subtags: state.subtags,
  });
};

export { currentPlan };
