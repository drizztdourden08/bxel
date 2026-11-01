/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { useTilemapStore } from '../stores/useTilemapStore';
import { inBounds } from '../tilemap/in-bounds';
import { pickTile } from '../tilemap/pick-tile';
import { placeStampAt } from '../tilemap/place-stamp-at';
import type { MapTarget } from '../tilemap/tilemap.type';
import type { PixelViewportHandle } from '../views/PixelViewport';
import { cellOf } from '../views/TilemapCanvas/behavior/cell-of';
import { TILE_DRAG } from './tile-drag.constants';
import type { TileDragPayload } from './tile-drag.type';

const useMapTileDrop = (ref: RefObject<DndElement | null>, viewport: RefObject<PixelViewportHandle | null>, target: MapTarget): void =>
  useDropTarget<TileDragPayload>(ref, {
    accepts: TILE_DRAG,
    canDrop: (_payload, info) => {
      const pixel = viewport.current?.screenToPixel(info.point.x, info.point.y);
      return pixel !== undefined && inBounds(target.tilemap, cellOf(pixel, target));
    },
    onDrop: (payload, info) => {
      const pixel = viewport.current?.screenToPixel(info.point.x, info.point.y);
      if (!pixel) return;
      const cell = cellOf(pixel, target);
      if (!inBounds(target.tilemap, cell)) return;
      if (!useTilemapStore.getState().stamp.keys.includes(payload.key)) pickTile(payload.key);
      placeStampAt([cell]);
    },
  });

export { useMapTileDrop };
