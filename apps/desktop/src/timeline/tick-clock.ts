/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { advanceClock } from './advance-clock';
import { currentFocus } from './current-focus';
import { currentPlan } from './current-plan';
import { CLOCK } from './playback-clock.constants';
import { positionAt } from './position-at';
import { resetClock } from './reset-clock';
import { showPosition } from './show-position';
import { stopPlayback } from './stop-playback';

const tickClock = (now: number): boolean => {
  const state = useTimelineStore.getState();
  const focus = state.playing ? currentFocus() : null;
  if (!focus) {
    if (state.playing) state.pause();
    resetClock();
    return false;
  }
  const plan = currentPlan(focus);
  if (plan.steps.length < 2) {
    state.pause();
    resetClock();
    return false;
  }
  advanceClock(plan, focus, now, state.speed);
  const position = positionAt(plan, CLOCK.elapsed, state.playOnce ? 'once' : state.playMode);
  showPosition(plan, focus, position);
  if (position.done) {
    stopPlayback();
    resetClock();
  }
  return !position.done;
};

export { tickClock };
