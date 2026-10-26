/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { selectFrameIds } from './select-frame-ids';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const addFrame = (): void => {
  const focus = currentFocus();
  if (!focus) return;
  const at = focus.animation.frames.findIndex((frame) => frame.id === focus.frame.id) + 1;
  const steps = [
    animationStep(focus, COMMAND_NAME.animationFrameAdd, { source: { kind: 'empty', count: 1 }, at }, TIMELINE_REF.frame),
    animationStep(focus, COMMAND_NAME.animationFrameOwn, { frame: { by: 'index', index: at } }),
  ];
  const done = runDocument(TIMELINE_LABEL.addFrame, steps);
  const created = done?.created[TIMELINE_REF.frame];
  if (created !== undefined) selectFrameIds([created as AnimFrameId]);
};

export { addFrame };
