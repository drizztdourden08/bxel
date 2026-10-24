/* @layer renderer-app @kind logic */
import { COMMAND_NAME, MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { spriteStep } from './sprite-step';
import { TIMELINE_LABEL } from './timeline.constants';

const setDuration = (durationMs: number): boolean => {
  const target = currentTarget();
  if (!target || !Number.isFinite(durationMs)) return false;
  const clamped = Math.min(Math.max(Math.round(durationMs), MIN_DURATION_MS), MAX_DURATION_MS);
  const { frames } = currentSelection(target);
  const steps = frames.map((id) => spriteStep(target, COMMAND_NAME.frameUpdate, { frame: idRef(id), durationMs: clamped }));
  return runDocument(TIMELINE_LABEL.duration, steps) !== null;
};

export { setDuration };
