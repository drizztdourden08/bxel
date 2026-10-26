/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const setOffset = (x: number, y: number): boolean => {
  const focus = currentFocus();
  if (!focus || focus.frame.spriteId === null) return false;
  const step = animationStep(focus, COMMAND_NAME.animationFrameUpdate, { frame: idRef(focus.frame.id), offset: { x, y } });
  return runDocument(TIMELINE_LABEL.placement, [step]) !== null;
};

const nudgeOffset = (dx: number, dy: number): boolean => {
  const focus = currentFocus();
  return focus !== null && setOffset(focus.frame.offset.x + dx, focus.frame.offset.y + dy);
};

export { nudgeOffset, setOffset };
