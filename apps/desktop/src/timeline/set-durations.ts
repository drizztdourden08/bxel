/* @layer renderer-app @kind logic */
import { COMMAND_NAME, MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const clampDuration = (durationMs: number): number => Math.min(Math.max(Math.round(durationMs), MIN_DURATION_MS), MAX_DURATION_MS);

const setDurations = (durations: ReadonlyMap<AnimFrameId, number>): boolean => {
  const focus = currentFocus();
  if (!focus || durations.size === 0) return false;
  const steps = [...durations].map(([id, ms]) => animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(id), durationMs: clampDuration(ms) }));
  return runDocument(TIMELINE_LABEL.duration, steps) !== null;
};

export { setDurations };
