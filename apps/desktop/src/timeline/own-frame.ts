/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const ownFrame = (label: string = TIMELINE_LABEL.own): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const step = animationStep(focus, COMMAND_NAME.animationFrameOwn, { frame: idRef(focus.frame.id) });
  return runDocument(label, [step]) !== null;
};

export { ownFrame };
