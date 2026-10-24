/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { SpriteId } from '@bxel/document';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import type { SceneModel } from '../../../sheet/sheet.type';
import { selectionIds } from '../../../sheet/selection-ids';
import { DRAG_TYPE } from '../SpritesPanel.constants';
import type { SpriteDragHandlers } from '../SpritesPanel.type';

const useSpriteDrag = (model: SceneModel | null): ((id: SpriteId) => SpriteDragHandlers) => {
  const dragged = useRef<SpriteId | null>(null);
  return (id) => ({
    onDragStart: (event) => {
      dragged.current = id;
      event.dataTransfer.setData(DRAG_TYPE, id);
      event.dataTransfer.effectAllowed = 'move';
    },
    onDragOver: (event) => {
      if (dragged.current !== null) event.preventDefault();
    },
    onDrop: (event) => {
      event.preventDefault();
      const from = dragged.current;
      dragged.current = null;
      if (from === null || from === id || !model) return;
      const chosen = selectionIds(model.scene);
      const to = model.artwork.sprites.findIndex((sprite) => sprite.id === id);
      reorderSprites(chosen.includes(from) ? chosen : [from], { to: Math.max(0, to) });
    },
  });
};

export { useSpriteDrag };
