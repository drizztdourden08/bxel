/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import { MAP_MENU } from '../TilemapCanvas.constants';
import type { MapLive } from '../TilemapCanvas.type';
import { mapHere } from './map-here';
import { mapMenuEntries } from './map-menu-entries';
import { selectClickedCell } from './select-clicked-cell';

const useMapMenu = (viewport: RefObject<PixelViewportHandle | null>, target: MapTarget, live: RefObject<MapLive>): void => {
  useContextMenu(MAP_MENU.zone, {
    label: MAP_MENU.label,
    shouldOpen: () => useToolStore.getState().tool !== 'zoom',
    anchor: () => {
      const cell = live.current.hover;
      const pixel = useReadoutStore.getState().pointer;
      const at = cell && pixel ? viewport.current?.pixelToScreen(pixel.x + 0.5, pixel.y + 0.5) : undefined;
      return at && cell ? { x: at.x, y: at.y, data: cell } : null;
    },
    beforeOpen: (context: ContextMenuContext) => selectClickedCell(mapHere(context, viewport.current, target)),
    entries: (context) => mapMenuEntries(target, mapHere(context, viewport.current, target)),
  });
};

export { useMapMenu };
