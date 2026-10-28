/* @layer renderer-app @kind logic */
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { pickAnimation } from '../../../sheet-manager/pick-animation';
import { pickVisible } from '../../../sheet-manager/pick-visible';
import { pickTab } from '../../../workspace/pick-tab';
import type { KeyAction, KeyShape, ManagerModel } from '../SpritesPanel.type';

const openPicked = (model: ManagerModel): void => {
  const strip = model.animationFacts.find((fact) => model.picked.includes(fact.key));
  if (strip && model.ids.length === 0) pickTab({ kind: 'animation', id: strip.animation.id });
  else isolateSprite();
};

const selectionAction = (event: KeyShape, model: ManagerModel): KeyAction | null => {
  const active = model.scene.active;
  if (event.key === 'Escape') return model.scene.selected.length > 0 || model.picked.length > 0 ? clearSpriteSelection : null;
  if (event.key !== ' ') return null;
  const lastStrip = model.picked.at(-1);
  if (lastStrip !== undefined && model.ids.length === 0) return () => pickAnimation(model.animations.map((fact) => fact.key), lastStrip, 'toggle');
  return active ? () => pickVisible(model.order, active.id, 'toggle') : null;
};

const commandAction = (event: KeyShape, model: ManagerModel): KeyAction | null => {
  if (event.key === 'Enter') return () => openPicked(model);
  return selectionAction(event, model);
};

export { commandAction };
