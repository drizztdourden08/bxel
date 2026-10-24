/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { FrameId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { spriteStep } from './sprite-step';
import { TIMELINE_LABEL } from './timeline.constants';

const moveFrames = (delta: number, only?: readonly FrameId[]): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const all = target.sprite.frames.map((frame) => frame.id);
  const picked = [...(only ?? currentSelection(target).frames)].sort((a, b) => all.indexOf(a) - all.indexOf(b));
  const first = all.indexOf(picked[0] ?? target.frameId);
  const last = all.indexOf(picked.at(-1) ?? target.frameId);
  const shift = Math.max(-first, Math.min(delta, all.length - 1 - last));
  if (shift === 0) return false;
  const ordered = shift > 0 ? [...picked].reverse() : picked;
  const steps = ordered.map((id) => spriteStep(target, COMMAND_NAME.frameReorder, { frame: idRef(id), to: all.indexOf(id) + shift }));
  return runDocument(TIMELINE_LABEL.moveFrame, steps) !== null;
};

export { moveFrames };
