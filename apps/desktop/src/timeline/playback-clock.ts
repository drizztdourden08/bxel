/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { currentPlan } from './current-plan';
import { cursorOfFrame, offsetOf, positionAt } from './play-position';
import { stopPlayback } from './stop-playback';

interface Clock {
  elapsed: number;
  last: number | null;
  shown: AnimFrameId | null;
}

const clock: Clock = { elapsed: 0, last: null, shown: null };

const resetClock = (): void => {
  clock.elapsed = 0;
  clock.last = null;
  clock.shown = null;
};

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
  if (clock.last === null || clock.shown !== focus.frame.id) clock.elapsed = offsetOf(plan, cursorOfFrame(plan, focus.frame.id));
  else clock.elapsed += (now - clock.last) * state.speed;
  clock.last = now;
  const position = positionAt(plan, clock.elapsed, state.playOnce ? 'once' : state.playMode);
  const step = plan.steps[position.cursor];
  if (step) {
    clock.shown = step.frameId;
    if (step.frameId !== focus.frame.id || state.cursor !== position.cursor) useTimelineStore.setState({ frameId: step.frameId, cursor: position.cursor });
  }
  if (position.done) {
    stopPlayback();
    resetClock();
  }
  return !position.done;
};

export { resetClock, tickClock };
