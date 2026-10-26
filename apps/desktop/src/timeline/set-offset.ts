/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { idRef } from './id-ref';
import { placedFocus } from './placed-focus';
import { TIMELINE_LABEL } from './timeline.constants';

const setOffset = (x: number, y: number): boolean => {
  const focus = placedFocus();
  if (!focus) return false;
  const step = animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(focus.frame.id), offset: { x, y } });
  return runDocument(TIMELINE_LABEL.placement, [step]) !== null;
};

export { setOffset };
