/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { setLayout } from '../tilemap/set-layout';
import { TILE_DRAG } from './tile-drag.constants';
import type { TileDragPayload } from './tile-drag.type';

const useTileSlotDrop = (ref: RefObject<DndElement | null>, index: number): void =>
  useDropTarget<TileDragPayload>(ref, {
    accepts: TILE_DRAG,
    canDrop: (payload) => payload.index !== index,
    onDrop: (payload) => {
      setLayout({ move: [{ key: payload.key, to: index }] });
    },
  });

export { useTileSlotDrop };
