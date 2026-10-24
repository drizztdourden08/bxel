/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { FrameId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { idRef } from './id-ref';
import { selectFrameIds } from './select-frame-ids';
import { spriteStep } from './sprite-step';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const addFrame = (): void => {
  const target = currentTarget();
  if (!target) return;
  const options = { after: idRef(target.frameId) };
  const done = runDocument(TIMELINE_LABEL.addFrame, [spriteStep(target, COMMAND_NAME.frameAdd, options, TIMELINE_REF.frame)]);
  const created = done?.created[TIMELINE_REF.frame];
  if (created !== undefined) selectFrameIds(target.layerId, [created as FrameId], undefined);
};

export { addFrame };
