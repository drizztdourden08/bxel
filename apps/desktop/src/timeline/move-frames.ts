/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { framePick } from './frame-pick';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';
import { TIMELINE_SAY } from './timeline-say.constants';

const moveFrames = (delta: number, only?: readonly AnimFrameId[]): boolean => {
  const pick = framePick(only);
  if (!pick) return false;
  const { focus, order: all } = pick;
  const picked = [...pick.picked].sort((a, b) => all.indexOf(a) - all.indexOf(b));
  const first = all.indexOf(picked[0] ?? focus.frame.id);
  const last = all.indexOf(picked.at(-1) ?? focus.frame.id);
  const shift = Math.max(-first, Math.min(delta, all.length - 1 - last));
  if (shift === 0) return false;
  const ordered = shift > 0 ? [...picked].reverse() : picked;
  const steps = ordered.map((id) => animationStep(focus, COMMAND_NAME.animationFrameReorder, { frame: idRef(id), to: all.indexOf(id) + shift }));
  if (runDocument(TIMELINE_LABEL.moveFrame, steps) === null) return false;
  announce(TIMELINE_SAY.moved(first + shift + 1, all.length));
  return true;
};

export { moveFrames };
