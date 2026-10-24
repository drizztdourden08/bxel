/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { pickVisible } from '../../../sheet-manager/pick-visible';
import type { ManagerModel, SpriteHandlers } from '../SpritesPanel.type';

const handlersFor =
  (model: ManagerModel, begin: (id: SpriteId) => void) =>
  (id: SpriteId): SpriteHandlers => ({
    onPick: (how) => pickVisible(model.order, id, how),
    onRename: () => begin(id),
    onMenu: () => {
      if (!model.scene.selected.some((sprite) => sprite.id === id)) pickVisible(model.order, id, 'replace');
    },
  });

export { handlersFor };
