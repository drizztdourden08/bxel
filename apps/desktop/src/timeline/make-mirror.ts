/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFacing, AnimFlip, TagId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const makeMirror = (tagId: TagId, facing: AnimFacing, flip: AnimFlip = 'x'): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const step = animationStep(focus, COMMAND_NAME.animationTagAdd, { kind: 'mirror', of: idRef(tagId), flip, facing });
  return runDocument(TIMELINE_LABEL.mirror, [step]) !== null;
};

export { makeMirror };
