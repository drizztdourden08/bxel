/* @layer renderer-app @kind logic */
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { deleteSprites } from '../../../sheet/delete-sprites';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { pickVisible } from '../../../sheet-manager/pick-visible';
import { selectIds } from '../../../sheet-manager/select-ids';
import type { KeyAction, KeyShape, ManagerModel } from '../SpritesPanel.type';

const selectionAction = (event: KeyShape, model: ManagerModel): KeyAction | null => {
  const active = model.scene.active;
  if (event.key === 'Escape') return model.scene.selected.length > 0 ? clearSpriteSelection : null;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') return () => selectIds(model.order);
  return event.key === ' ' && active ? () => pickVisible(model.order, active.id, 'toggle') : null;
};

const commandAction = (event: KeyShape, model: ManagerModel, rename: KeyAction): KeyAction | null => {
  if (event.key === 'F2') return rename;
  if (event.key === 'Delete') return () => deleteSprites(model.ids);
  if (event.key === 'Enter') return () => isolateSprite();
  return selectionAction(event, model);
};

export { commandAction };
