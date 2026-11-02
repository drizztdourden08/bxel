/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../asset-drag/asset-drag.constants';
import { inBounds } from '../tilemap/in-bounds';
import type { MapTarget } from '../tilemap/tilemap.type';
import type { PixelViewportHandle } from '../views/PixelViewport';
import { cellOf } from '../views/TilemapCanvas/behavior/cell-of';
import { canDropOnMap, dropOnMap } from './map-drop';
import { TILE_DRAG } from './tile-drag.constants';
import type { MapDropPayload } from './tile-drag.type';

const useMapTileDrop = (ref: RefObject<DndElement | null>, viewport: RefObject<PixelViewportHandle | null>, target: MapTarget): void => {
  const cellAt = (point: { x: number; y: number }) => {
    const pixel = viewport.current?.screenToPixel(point.x, point.y);
    const cell = pixel ? cellOf(pixel, target) : null;
    return cell && inBounds(target.tilemap, cell) ? cell : null;
  };
  useDropTarget<MapDropPayload>(ref, {
    accepts: [TILE_DRAG, dnd.files, ASSET_DRAG],
    canDrop: (payload, info) => canDropOnMap(payload, cellAt(info.point) !== null),
    onDrop: (payload, info) => dropOnMap(payload, cellAt(info.point)),
  });
};

export { useMapTileDrop };
