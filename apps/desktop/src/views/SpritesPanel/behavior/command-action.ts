/* @layer renderer-app @kind logic */
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { pickVisible } from '../../../sheet-manager/pick-visible';
import type { KeyAction, KeyShape, ManagerModel } from '../SpritesPanel.type';

const selectionAction = (event: KeyShape, model: ManagerModel): KeyAction | null => {
  const active = model.scene.active;
  if (event.key === 'Escape') return model.scene.selected.length > 0 ? clearSpriteSelection : null;
  return event.key === ' ' && active ? () => pickVisible(model.order, active.id, 'toggle') : null;
};

const commandAction = (event: KeyShape, model: ManagerModel): KeyAction | null => {
  if (event.key === 'Enter') return () => isolateSprite();
  return selectionAction(event, model);
};

export { commandAction };
