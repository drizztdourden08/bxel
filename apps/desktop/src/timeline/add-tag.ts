/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFacing, TagId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { newTagName } from './new-tag-name';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

interface TagSpan {
  start: number;
  end: number;
}

const addTag = (span?: TagSpan, facing?: AnimFacing): void => {
  const focus = currentFocus();
  if (!focus) return;
  const { frames } = focus.animation;
  const picked = span ? [frames[Math.min(span.start, span.end)]?.id, frames[Math.max(span.start, span.end)]?.id] : [currentSelection(focus)[0], currentSelection(focus).at(-1)];
  const [from, to] = picked;
  if (from === undefined || to === undefined) return;
  const options = {
    kind: 'span',
    name: newTagName(focus.animation),
    from: idRef(from),
    to: idRef(to),
    direction: 'forward',
    ...(facing === undefined ? {} : { facing }),
  };
  const done = runDocument(TIMELINE_LABEL.addTag, [animationStep(focus, COMMAND_NAME.animationTagAdd, options, TIMELINE_REF.tag)]);
  const created = done?.created[TIMELINE_REF.tag];
  if (created === undefined) return;
  const state = useTimelineStore.getState();
  state.selectTag(created as TagId);
  state.setPopover({ kind: 'tag', tagId: created as TagId });
};

export { addTag };
