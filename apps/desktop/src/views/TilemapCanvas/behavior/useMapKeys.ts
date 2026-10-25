/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { ARROW_DELTAS } from '../../../editor/selection/selection.constants';
import { useCursorRelease } from '../../../hooks/useCursorRelease';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { MapGesture, MapKeys, MapLive } from '../TilemapCanvas.type';
import { moveMapCursor } from './move-map-cursor';
import { pressMapCell } from './press-map-cell';

const useMapKeys = (viewport: RefObject<PixelViewportHandle | null>, target: MapTarget, live: RefObject<MapLive>, gesture: MapGesture): MapKeys => {
  const active = useRef(false);
  const context = { viewport, target, live, active };
  return {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        gesture.cancel();
        return;
      }
      if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const handled = event.key in ARROW_DELTAS ? moveMapCursor(event.key, context) : (event.key === 'Enter' || event.key === ' ') && pressMapCell(context);
      if (handled) event.preventDefault();
    },
    ...useCursorRelease(active),
  };
};

export { useMapKeys };
