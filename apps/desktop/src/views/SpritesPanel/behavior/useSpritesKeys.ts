/* @layer renderer-app @kind hook */
import type { SpriteId } from '@bxel/document';
import type { ManagerModel, SpriteKeyHandler } from '../SpritesPanel.type';
import { columnsOf } from './columns-of';
import { commandAction } from './command-action';
import { navAction } from './nav-action';

const useSpritesKeys = (model: ManagerModel | null, begin: (spriteId: SpriteId) => void): SpriteKeyHandler => (event) => {
  const active = model?.scene.active;
  if (!model || !active || event.target instanceof HTMLInputElement) return;
  const action = navAction(event, model, columnsOf(event.currentTarget)) ?? commandAction(event, model, () => begin(active.id));
  if (!action) return;
  event.preventDefault();
  event.stopPropagation();
  action();
};

export { useSpritesKeys };
