/* @layer renderer-app @kind hook */
import type { KeyHandlers, ManagerModel, SpriteKeyHandler } from '../SpritesPanel.type';
import { columnsOf } from './columns-of';
import { commandAction } from './command-action';
import { navAction } from './nav-action';

const useSpritesKeys = (model: ManagerModel | null, handlers: KeyHandlers): SpriteKeyHandler => (event) => {
  const active = model?.scene.active;
  if (!model || !active || event.target instanceof HTMLInputElement) return;
  const action = navAction(event, model, columnsOf(event.currentTarget)) ?? commandAction(event, model, handlers);
  if (!action) return;
  event.preventDefault();
  event.stopPropagation();
  action();
};

export { useSpritesKeys };
