/* @layer renderer-app @kind logic */
import { animFramePivot, COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const setPivot = (x2: number | null, y2: number | null): boolean => {
  const focus = currentFocus();
  if (!focus || focus.frame.spriteId === null) return false;
  const now = animFramePivot(focus.artwork, focus.animation, focus.frame);
  const pivot = { x2: x2 ?? now.x2, y2: y2 ?? now.y2 };
  if (pivot.x2 === now.x2 && pivot.y2 === now.y2) return false;
  const step = animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(focus.frame.id), pivot });
  return runDocument(TIMELINE_LABEL.pivot, [step]) !== null;
};

export { setPivot };
