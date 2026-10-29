/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { placedFocus } from './placed-focus';
import { TIMELINE_LABEL } from './timeline.constants';

const setOffset = (x: number | null, y: number | null): boolean => {
  const focus = placedFocus();
  if (!focus) return false;
  const picked = currentSelection(focus);
  const steps = focus.animation.frames
    .filter((frame) => picked.includes(frame.id) && frame.spriteId !== null)
    .map((frame) => animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(frame.id), offset: { x: x ?? frame.offset.x, y: y ?? frame.offset.y } }));
  return steps.length > 0 && runDocument(TIMELINE_LABEL.placement, steps) !== null;
};

export { setOffset };
