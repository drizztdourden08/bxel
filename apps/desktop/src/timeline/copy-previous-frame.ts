/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { selectFrameIds } from './select-frame-ids';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const copyPreviousFrame = (): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const frames = focus.animation.frames;
  const at = frames.findIndex((frame) => frame.id === focus.frame.id);
  const previous = frames[at - 1];
  if (at < 1 || !previous) return false;
  const ref = `${TIMELINE_REF.copy}previous`;
  const steps = [
    animationStep(focus, COMMAND_NAME.animationFrameAdd, { source: { kind: 'duplicate', frame: idRef(previous.id) }, at }, ref),
    animationStep(focus, COMMAND_NAME.animationFrameDelete, { frames: [idRef(focus.frame.id)] }),
  ];
  const done = runDocument(TIMELINE_LABEL.copyPrevious, steps);
  if (!done) return false;
  selectFrameIds((done.created[ref] ?? []) as AnimFrameId[]);
  return true;
};

export { copyPreviousFrame };
