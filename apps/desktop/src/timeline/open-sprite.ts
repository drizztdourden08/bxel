/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import { pickTab } from '../workspace/pick-tab';
import { currentFocus } from './current-focus';

const openSprite = (): boolean => {
  const focus = currentFocus();
  const sprite = focus?.frame.spriteId == null ? undefined : findSprite(focus.artwork, focus.frame.spriteId);
  if (!sprite || sprite.role !== 'sprite') return false;
  pickTab({ kind: 'sprite', id: sprite.id });
  return true;
};

export { openSprite };
