/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { COMMAND_NAME, MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';
import { TIMELINE_SAY } from './timeline-say.constants';

const clampDuration = (durationMs: number): number => Math.min(Math.max(Math.round(durationMs), MIN_DURATION_MS), MAX_DURATION_MS);

const setDurations = (durations: ReadonlyMap<AnimFrameId, number>): boolean => {
  const focus = currentFocus();
  if (!focus || durations.size === 0) return false;
  const steps = [...durations].map(([id, ms]) => animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(id), durationMs: clampDuration(ms) }));
  if (runDocument(TIMELINE_LABEL.duration, steps) === null) return false;
  const values = new Set([...durations.values()].map(clampDuration));
  announce(TIMELINE_SAY.duration(durations.size, values.size === 1 ? ([...values][0] ?? null) : null));
  return true;
};

export { setDurations };
