/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { selectFrameIds } from './select-frame-ids';
import { spriteStep } from './sprite-step';
import { TIMELINE_LABEL } from './timeline.constants';

const deleteFrames = (): void => {
  const target = currentTarget();
  if (!target) return;
  const { frames } = currentSelection(target);
  const all = target.sprite.frames.map((frame) => frame.id);
  const keep = all.filter((id) => !frames.includes(id));
  const next = keep[Math.min(all.indexOf(frames[0] ?? target.frameId), keep.length - 1)];
  const steps = frames.map((id) => spriteStep(target, COMMAND_NAME.frameDelete, { frame: idRef(id) }));
  if (runDocument(TIMELINE_LABEL.deleteFrame, steps) && next !== undefined) selectFrameIds(target.layerId, [next], undefined);
};

export { deleteFrames };
