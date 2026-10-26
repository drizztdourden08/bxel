/* @layer renderer-app @kind logic */
import { COMMAND_NAME, MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const setDuration = (durationMs: number): boolean => {
  const focus = currentFocus();
  if (!focus || !Number.isFinite(durationMs)) return false;
  const clamped = Math.min(Math.max(Math.round(durationMs), MIN_DURATION_MS), MAX_DURATION_MS);
  const steps = currentSelection(focus).map((id) => animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(id), durationMs: clamped }));
  return runDocument(TIMELINE_LABEL.duration, steps) !== null;
};

export { setDuration };
