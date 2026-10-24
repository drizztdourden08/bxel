/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { FrameId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { selectFrameIds } from './select-frame-ids';
import { spriteStep } from './sprite-step';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const duplicateFrames = (): void => {
  const target = currentTarget();
  if (!target) return;
  const { frames } = currentSelection(target);
  const last = frames.at(-1);
  if (last === undefined) return;
  const refOf = (index: number): string => `${TIMELINE_REF.copy}${index}`;
  const steps = frames
    .map((id, index) => spriteStep(target, COMMAND_NAME.frameAdd, { after: idRef(last), copyOf: idRef(id) }, refOf(index)))
    .reverse();
  const done = runDocument(TIMELINE_LABEL.duplicateFrame, steps);
  if (!done) return;
  const made = frames.flatMap((_, index) => done.created[refOf(index)] ?? []) as FrameId[];
  selectFrameIds(target.layerId, made, undefined);
};

export { duplicateFrames };
