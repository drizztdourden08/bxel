/* @layer renderer-app @kind hook */
import type { SpriteId } from '@bxel/document';
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import { useEffectiveDefaults } from '../../../asset-defaults/useEffectiveDefaults';
import { canDropOnCanvas } from '../../../canvas-drop/can-drop-on-canvas';
import type { CanvasDropPayload } from '../../../canvas-drop/canvas-drop.type';
import { dropOnSprite } from '../../../canvas-drop/drop-on-sprite';
import { useActiveDocument } from '../../../hooks/useActiveDocument';

const useCanvasDrop = (ref: RefObject<DndElement | null>, spriteId: SpriteId | null): void => {
  const defaults = useEffectiveDefaults();
  const view = useActiveDocument();
  const readOnly = view?.state.readOnly ?? false;
  useDropTarget<CanvasDropPayload>(ref, {
    accepts: [dnd.files, ASSET_DRAG],
    canDrop: (payload) => canDropOnCanvas(payload, (id) => view?.state.artwork.banks.some((bank) => bank.id === id) ?? false),
    onDrop: (payload) => dropOnSprite(payload, { spriteId, readOnly }, defaults),
  });
};

export { useCanvasDrop };
