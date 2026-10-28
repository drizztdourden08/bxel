/* @layer renderer-app @kind logic */
import type { TimeUnits } from '../stores/timeline-store.type';
import { currentPlan } from './current-plan';
import { fpsOf } from './fps-of';
import { formatClock } from './format-duration';
import { cursorOfFrame, offsetOf } from './play-position';
import { TIMELINE_TEXT } from './timeline.constants';
import type { AnimationFocus } from './timeline.type';

interface TimeReadout {
  clock: string;
  fps: string;
}

const timeReadout = (focus: AnimationFocus, units: TimeUnits): TimeReadout => {
  const plan = currentPlan(focus);
  const at = offsetOf(plan, Math.max(0, cursorOfFrame(plan, focus.frame.id)));
  return { clock: formatClock(at, plan.cycleMs, units), fps: TIMELINE_TEXT.fps(fpsOf(plan)) };
};

export { timeReadout };
export type { TimeReadout };
