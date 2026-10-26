/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import { pickTab } from '../workspace/pick-tab';
import { currentFocus } from './current-focus';

const openSprite = (): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const id = focus.frame.spriteId;
  const sprite = id === null ? undefined : findSprite(focus.artwork, id);
  if (sprite?.role !== 'sprite') return false;
  pickTab({ kind: 'sprite', id: sprite.id });
  return true;
};

export { openSprite };
