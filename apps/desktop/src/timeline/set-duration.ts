/* @layer renderer-app @kind logic */
import { COMMAND_NAME, MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const clampDuration = (durationMs: number): number => Math.min(Math.max(Math.round(durationMs), MIN_DURATION_MS), MAX_DURATION_MS);

const setDurations = (durations: ReadonlyMap<AnimFrameId, number>): boolean => {
  const focus = currentFocus();
  if (!focus || durations.size === 0) return false;
  const steps = [...durations].map(([id, ms]) => animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(id), durationMs: clampDuration(ms) }));
  return runDocument(TIMELINE_LABEL.duration, steps) !== null;
};

const setDurationOf = (ids: readonly AnimFrameId[], durationMs: number): boolean =>
  Number.isFinite(durationMs) && setDurations(new Map(ids.map((id) => [id, durationMs])));

const setDuration = (durationMs: number): boolean => {
  const focus = currentFocus();
  return focus !== null && setDurationOf(currentSelection(focus), durationMs);
};

export { setDuration, setDurationOf, setDurations };
