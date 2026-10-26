/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentFocus } from '../timeline/current-focus';
import { selectFrameIds } from '../timeline/select-frame-ids';
import { TIMELINE_LABEL } from '../timeline/timeline.constants';
import type { AddRequest } from './add-frames.type';
import { addFramesSteps } from './add-frames-steps';

const runAddFrames = (request: AddRequest): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const steps = addFramesSteps(focus.artwork, focus.animation, request);
  if (steps.length === 0) return false;
  const known = new Set(focus.animation.frames.map((frame) => frame.id));
  if (runDocument(TIMELINE_LABEL.addFrames, steps) === null) return false;
  const after = currentFocus();
  const made = (after?.animation.frames ?? []).map((frame) => frame.id).filter((id): id is AnimFrameId => !known.has(id));
  selectFrameIds(made);
  return true;
};

export { runAddFrames };
