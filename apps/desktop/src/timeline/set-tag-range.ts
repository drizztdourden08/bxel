/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { changeTag } from './change-tag';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { TIMELINE_LABEL } from './timeline.constants';

const setTagRange = (tagId: TagId): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const { frames } = currentSelection(target);
  const [from] = frames;
  const to = frames.at(-1);
  if (from === undefined || to === undefined) return false;
  return changeTag(TIMELINE_LABEL.updateTag, tagId, { from: idRef(from), to: idRef(to) });
};

export { setTagRange };
