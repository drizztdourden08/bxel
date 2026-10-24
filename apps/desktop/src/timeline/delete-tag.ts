/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { idRef } from './id-ref';
import { spriteStep } from './sprite-step';
import { TIMELINE_LABEL } from './timeline.constants';

const deleteTag = (tagId: TagId): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const done = runDocument(TIMELINE_LABEL.deleteTag, [spriteStep(target, COMMAND_NAME.tagDelete, { tag: idRef(tagId) })]);
  if (done) useTimelineStore.getState().selectTag(null);
  return done !== null;
};

export { deleteTag };
