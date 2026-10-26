/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { selectFrameIds } from './select-frame-ids';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const duplicateFrames = (): void => {
  const focus = currentFocus();
  if (!focus) return;
  const picked = currentSelection(focus);
  const order = focus.animation.frames.map((frame) => frame.id);
  const last = Math.max(...picked.map((id) => order.indexOf(id)));
  const refOf = (index: number): string => `${TIMELINE_REF.copy}${index}`;
  const steps = picked.map((id, index) =>
    animationStep(focus, COMMAND_NAME.animationFrameAdd, { source: { kind: 'duplicate', frame: idRef(id) }, at: last + 1 + index }, refOf(index)),
  );
  const done = runDocument(TIMELINE_LABEL.duplicateFrame, steps);
  if (!done) return;
  const made = picked.flatMap((_, index) => done.created[refOf(index)] ?? []) as AnimFrameId[];
  selectFrameIds(made);
};

export { duplicateFrames };
