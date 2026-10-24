/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { spriteStep } from './sprite-step';
import { newTagName } from './new-tag-name';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const addTag = (): void => {
  const target = currentTarget();
  if (!target) return;
  const { frames } = currentSelection(target);
  const [from] = frames;
  const to = frames.at(-1);
  if (from === undefined || to === undefined) return;
  const options = { name: newTagName(target.sprite), from: idRef(from), to: idRef(to), direction: 'forward' };
  const done = runDocument(TIMELINE_LABEL.addTag, [spriteStep(target, COMMAND_NAME.tagAdd, options, TIMELINE_REF.tag)]);
  const created = done?.created[TIMELINE_REF.tag];
  if (created !== undefined) useTimelineStore.getState().selectTag(created as TagId);
};

export { addTag };
