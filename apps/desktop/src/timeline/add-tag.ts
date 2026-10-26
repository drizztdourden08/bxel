/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { newTagName } from './new-tag-name';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const addTag = (): void => {
  const focus = currentFocus();
  if (!focus) return;
  const picked = currentSelection(focus);
  const [from] = picked;
  const to = picked.at(-1);
  if (from === undefined || to === undefined) return;
  const options = { kind: 'span', name: newTagName(focus.animation), from: idRef(from), to: idRef(to), direction: 'forward' };
  const done = runDocument(TIMELINE_LABEL.addTag, [animationStep(focus, COMMAND_NAME.animationTagAdd, options, TIMELINE_REF.tag)]);
  const created = done?.created[TIMELINE_REF.tag];
  if (created !== undefined) useTimelineStore.getState().selectTag(created as TagId);
};

export { addTag };
