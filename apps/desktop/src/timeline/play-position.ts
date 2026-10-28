/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import type { PlayMode } from '../stores/timeline-store.type';
import type { PlayPlan, PlayPosition } from './play-plan.type';

const cursorAt = (plan: PlayPlan, time: number): number => {
  let cursor = 0;
  for (let each = 0; each < plan.starts.length; each += 1) {
    if ((plan.starts[each] ?? 0) <= time) cursor = each;
  }
  return cursor;
};

const positionAt = (plan: PlayPlan, elapsedMs: number, mode: PlayMode): PlayPosition => {
  const last = plan.steps.length - 1;
  if (last < 0 || plan.cycleMs <= 0) return { cursor: 0, done: true };
  if (mode === 'once' && elapsedMs >= plan.cycleMs) return { cursor: last, done: true };
  return { cursor: cursorAt(plan, mode === 'once' ? elapsedMs : elapsedMs % plan.cycleMs), done: false };
};

const offsetOf = (plan: PlayPlan, cursor: number): number => plan.starts[Math.min(Math.max(cursor, 0), plan.starts.length - 1)] ?? 0;

const cursorOfFrame = (plan: PlayPlan, frameId: AnimFrameId): number => plan.steps.findIndex((step) => step.frameId === frameId);

export { cursorOfFrame, offsetOf, positionAt };
