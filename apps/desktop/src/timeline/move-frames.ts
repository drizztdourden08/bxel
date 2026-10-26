/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const moveFrames = (delta: number, only?: readonly AnimFrameId[]): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const all = focus.animation.frames.map((frame) => frame.id);
  const picked = [...(only ?? currentSelection(focus))].sort((a, b) => all.indexOf(a) - all.indexOf(b));
  const first = all.indexOf(picked[0] ?? focus.frame.id);
  const last = all.indexOf(picked.at(-1) ?? focus.frame.id);
  const shift = Math.max(-first, Math.min(delta, all.length - 1 - last));
  if (shift === 0) return false;
  const ordered = shift > 0 ? [...picked].reverse() : picked;
  const steps = ordered.map((id) => animationStep(focus, COMMAND_NAME.animationFrameReorder, { frame: idRef(id), to: all.indexOf(id) + shift }));
  return runDocument(TIMELINE_LABEL.moveFrame, steps) !== null;
};

export { moveFrames };
