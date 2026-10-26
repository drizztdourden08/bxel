/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { selectFrameIds } from './select-frame-ids';
import { TIMELINE_LABEL } from './timeline.constants';

const deleteFrames = (): void => {
  const focus = currentFocus();
  if (!focus) return;
  const picked = currentSelection(focus);
  const all = focus.animation.frames.map((frame) => frame.id);
  const keep = all.filter((id) => !picked.includes(id));
  const next = keep[Math.min(all.indexOf(picked[0] ?? focus.frame.id), keep.length - 1)];
  const step = animationStep(focus, COMMAND_NAME.animationFrameDelete, { frames: picked.map(idRef) });
  if (runDocument(TIMELINE_LABEL.deleteFrame, [step]) && next !== undefined) selectFrameIds([next]);
};

export { deleteFrames };
