/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import { revealInProjectWindow } from '../project-browser/reveal-in-project-window';
import { assetPathOf } from '../sheet-manager/asset-path-of';
import { currentFocus } from './current-focus';

const showSpriteInProject = (): boolean => {
  const focus = currentFocus();
  const id = focus?.frame.spriteId ?? null;
  const sprite = focus === null || id === null ? undefined : findSprite(focus.artwork, id);
  if (sprite?.role !== 'sprite') return false;
  const path = assetPathOf(sprite.id);
  if (path === '') return false;
  revealInProjectWindow(path);
  return true;
};

export { showSpriteInProject };
