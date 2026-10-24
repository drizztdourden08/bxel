/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { pickVisible } from '../../../sheet-manager/pick-visible';
import type { ContextMenuState, ManagerModel, SpriteHandlers } from '../SpritesPanel.type';

const handlersFor =
  (model: ManagerModel, begin: (id: SpriteId) => void, menu: ContextMenuState) =>
  (id: SpriteId): SpriteHandlers => ({
    onPick: (how) => pickVisible(model.order, id, how),
    onRename: () => begin(id),
    onMenu: (event) => {
      if (!model.scene.selected.some((sprite) => sprite.id === id)) pickVisible(model.order, id, 'replace');
      menu.show(event);
    },
  });

export { handlersFor };
