/* @layer renderer-app @kind logic */
import type { AnimFacing } from '@bxel/document';
import { currentFocus } from './current-focus';
import { facingTag } from './facing-tag';
import { selectTag } from './select-tag';

const pickFacing = (facing: AnimFacing): boolean => {
  const focus = currentFocus();
  const tag = focus ? facingTag(focus.animation, facing) : undefined;
  if (!tag) return false;
  selectTag(tag.id);
  return true;
};

export { pickFacing };
