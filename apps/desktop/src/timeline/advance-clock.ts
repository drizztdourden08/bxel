/* @layer renderer-app @kind logic */
import { cursorOfFrame } from './cursor-of-frame';
import { offsetOf } from './offset-of';
import { CLOCK } from './playback-clock.constants';
import type { PlayPlan } from './play-plan.type';
import type { AnimationFocus } from './timeline.type';

const advanceClock = (plan: PlayPlan, focus: AnimationFocus, now: number, speed: number): void => {
  if (CLOCK.last === null || CLOCK.shown !== focus.frame.id) CLOCK.elapsed = offsetOf(plan, cursorOfFrame(plan, focus.frame.id));
  else CLOCK.elapsed += (now - CLOCK.last) * speed;
  CLOCK.last = now;
};

export { advanceClock };
