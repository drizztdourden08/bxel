/* @layer renderer-app @kind logic */
import { animFramePivot, COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { placedFocus } from './placed-focus';
import { TIMELINE_LABEL } from './timeline.constants';

const setPivot = (x2: number | null, y2: number | null): boolean => {
  const focus = placedFocus();
  if (!focus) return false;
  const picked = currentSelection(focus);
  const steps = focus.animation.frames.flatMap((frame) => {
    if (!picked.includes(frame.id) || frame.spriteId === null) return [];
    const now = animFramePivot(focus.artwork, focus.animation, frame);
    const pivot = { x2: x2 ?? now.x2, y2: y2 ?? now.y2 };
    if (pivot.x2 === now.x2 && pivot.y2 === now.y2) return [];
    return [animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(frame.id), pivot })];
  });
  return steps.length > 0 && runDocument(TIMELINE_LABEL.pivot, steps) !== null;
};

export { setPivot };
