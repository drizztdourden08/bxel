/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { pickAnimation } from '../../../sheet-manager/pick-animation';
import { pickVisible } from '../../../sheet-manager/pick-visible';
import { pickTab } from '../../../workspace/pick-tab';
import type { ManagerModel, SpriteHandlers } from '../SpritesPanel.type';

const animationHandlers = (model: ManagerModel, key: string): SpriteHandlers | null => {
  const fact = model.animationFacts.find((each) => each.key === key);
  if (!fact) return null;
  const order = model.animations.map((each) => each.key);
  return {
    onPick: (how) => pickAnimation(order, key, how),
    onEdit: () => pickTab({ kind: 'animation', id: fact.animation.id }),
    onRename: () => undefined,
    onMenu: () => {
      if (!model.picked.includes(key)) pickAnimation(order, key, 'replace');
    },
  };
};

const handlersFor =
  (model: ManagerModel, begin: (id: SpriteId) => void) =>
  (key: string): SpriteHandlers => {
    const id = key as SpriteId;
    return (
      animationHandlers(model, key) ?? {
        onPick: (how) => pickVisible(model.order, id, how),
        onEdit: () => isolateSprite(id),
        onRename: () => begin(id),
        onMenu: () => {
          if (!model.scene.selected.some((sprite) => sprite.id === id)) pickVisible(model.order, id, 'replace');
        },
      }
    );
  };

export { handlersFor };
