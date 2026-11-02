/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { editSlot } from '../tilemap/terrain/edit-slot';
import { TILE_DRAG } from './tile-drag.constants';
import type { TerrainSlotDropTarget, TileDragPayload } from './tile-drag.type';

const useTerrainSlotDrop = (ref: RefObject<DndElement | null>, target: TerrainSlotDropTarget): void =>
  useDropTarget<TileDragPayload>(ref, {
    accepts: TILE_DRAG,
    onDrop: (payload) => {
      editSlot({ slot: target.slot, action: 'use', key: payload.key, set: target.set });
    },
  });

export { useTerrainSlotDrop };
