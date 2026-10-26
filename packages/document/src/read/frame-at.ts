/* @layer core @kind logic */
import type { AnimSequence, AnimStep } from './anim-sequence.type';

const frameAt = (sequence: AnimSequence, timeMs: number): AnimStep | null => {
  const { steps, repeat, cycleMs } = sequence;
  const last = steps[steps.length - 1];
  if (!last || cycleMs <= 0) return null;
  const time = Math.max(0, timeMs);
  if (repeat > 0 && time >= repeat * cycleMs) return last;
  let remaining = time % cycleMs;
  for (const step of steps) {
    if (remaining < step.durationMs) return step;
    remaining -= step.durationMs;
  }
  return last;
};

export { frameAt };
