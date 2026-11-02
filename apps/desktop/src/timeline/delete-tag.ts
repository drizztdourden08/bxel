/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';
import { TIMELINE_SAY } from './timeline-say.constants';

const deleteTag = (tagId: TagId): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const done = runDocument(TIMELINE_LABEL.deleteTag, [animationStep(focus, COMMAND_NAME.animationTagDelete, { tag: idRef(tagId) })]);
  if (done && useTimelineStore.getState().tagId === tagId) useTimelineStore.getState().selectTag(null);
  if (done) announce(TIMELINE_SAY.tagDeleted);
  return done !== null;
};

export { deleteTag };
