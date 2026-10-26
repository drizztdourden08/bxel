/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { changeTag } from './change-tag';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const setTagRange = (tagId: TagId): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const picked = currentSelection(focus);
  const [from] = picked;
  const to = picked.at(-1);
  return from !== undefined && to !== undefined && changeTag(TIMELINE_LABEL.updateTag, tagId, { from: idRef(from), to: idRef(to) });
};

export { setTagRange };
