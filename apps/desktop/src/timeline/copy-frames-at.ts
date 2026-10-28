/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { framePick } from './frame-pick';
import { idRef } from './id-ref';
import { selectFrameIds } from './select-frame-ids';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const copyFramesAt = (at: number, linked: boolean, only?: readonly AnimFrameId[]): boolean => {
  const pick = framePick(only);
  if (!pick) return false;
  const { focus, order } = pick;
  const ids = order.filter((id) => pick.picked.includes(id));
  const refOf = (index: number): string => `${TIMELINE_REF.copy}${index}`;
  const steps = ids.map((id, index) => {
    const frame = focus.animation.frames.find((each) => each.id === id);
    const source =
      linked && frame?.spriteId
        ? { kind: 'sprite', sprite: idRef(frame.spriteId), mode: 'reference', ...(frame.clip ? { clip: frame.clip } : {}) }
        : { kind: 'duplicate', frame: idRef(id) };
    const fields = linked && frame ? { durationMs: frame.durationMs, offset: frame.offset, ...(frame.pivot ? { pivot: frame.pivot } : {}) } : {};
    return animationStep(focus, COMMAND_NAME.animationFrameAdd, { source, at: at + index, ...fields }, refOf(index));
  });
  const done = runDocument(linked ? TIMELINE_LABEL.linkFrames : TIMELINE_LABEL.duplicateFrame, steps);
  if (!done) return false;
  selectFrameIds(ids.flatMap((_, index) => done.created[refOf(index)] ?? []) as AnimFrameId[]);
  return true;
};

export { copyFramesAt };
