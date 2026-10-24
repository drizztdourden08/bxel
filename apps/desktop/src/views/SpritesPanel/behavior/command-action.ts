/* @layer renderer-app @kind logic */
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { pickVisible } from '../../../sheet-manager/pick-visible';
import { selectIds } from '../../../sheet-manager/select-ids';
import type { KeyAction, KeyHandlers, KeyShape, ManagerModel } from '../SpritesPanel.type';

const selectionAction = (event: KeyShape, model: ManagerModel): KeyAction | null => {
  const active = model.scene.active;
  if (event.key === 'Escape') return model.scene.selected.length > 0 ? clearSpriteSelection : null;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') return () => selectIds(model.order);
  return event.key === ' ' && active ? () => pickVisible(model.order, active.id, 'toggle') : null;
};

const commandAction = (event: KeyShape, model: ManagerModel, handlers: KeyHandlers): KeyAction | null => {
  const active = model.scene.active;
  if (event.key === 'F2') return active ? () => handlers.begin(active.id) : null;
  if (event.key === 'Delete') return () => handlers.open('delete');
  if (event.key === 'Enter') return () => isolateSprite();
  return selectionAction(event, model);
};

export { commandAction };
