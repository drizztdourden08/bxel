/* @layer renderer-app @kind logic */
import type { TimeUnits } from '../stores/timeline-store.type';
import { currentPlan } from './current-plan';
import { cursorOfFrame } from './cursor-of-frame';
import { fpsOf } from './fps-of';
import { formatClock } from './format-clock';
import { offsetOf } from './offset-of';
import { TIMELINE_TEXT } from './timeline.constants';
import type { TimeReadout } from './time-readout.type';
import type { AnimationFocus } from './timeline.type';

const timeReadout = (focus: AnimationFocus, units: TimeUnits): TimeReadout => {
  const plan = currentPlan(focus);
  const at = offsetOf(plan, Math.max(0, cursorOfFrame(plan, focus.frame.id)));
  return { clock: formatClock(at, plan.cycleMs, units), fps: TIMELINE_TEXT.fps(fpsOf(plan)) };
};

export { timeReadout };
