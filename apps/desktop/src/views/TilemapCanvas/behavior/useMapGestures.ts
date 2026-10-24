/* @layer renderer-app @kind hook */
import type { PointerEvent, RefObject } from 'react';
import type { Point } from '@bxel/document';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { MAP_TOOL_OF } from '../../../tilemap/tilemap.constants';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { PixelPoint, PixelViewportHandle } from '../../PixelViewport';
import type { MapGesture, MapLive } from '../TilemapCanvas.type';
import { beginDrag } from './begin-drag';
import { cellOf } from './cell-of';
import { extendDrag } from './extend-drag';
import { finishDrag } from './finish-drag';

const useMapGestures = (viewport: RefObject<PixelViewportHandle | null>, target: MapTarget, live: RefObject<MapLive>): MapGesture => {
  const tool = MAP_TOOL_OF[useToolStore((state) => state.tool)];
  const pixelAt = (event: PointerEvent<HTMLElement>): PixelPoint => viewport.current?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 };
  const cellAt = (event: PointerEvent<HTMLElement>): Point => cellOf(pixelAt(event), target.tileset);
  const redraw = (): void => viewport.current?.redraw();
  return {
    down: (event) => {
      if (tool === 'zoom') {
        if (event.button === 0) viewport.current?.zoomIn(pixelAt(event));
        if (event.button === 2) viewport.current?.zoomOut(pixelAt(event));
        return;
      }
      if (event.button !== 0) return;
      live.current.drag = beginDrag(tool, cellAt(event), target);
      if (live.current.drag) event.currentTarget.setPointerCapture(event.pointerId);
      redraw();
    },
    move: (event) => {
      const { drag } = live.current;
      if (drag) live.current.drag = extendDrag(drag, cellAt(event), useTilemapStore.getState().stamp, target);
      live.current.hover = cellAt(event);
      redraw();
    },
    up: () => {
      const { drag } = live.current;
      live.current.drag = null;
      if (drag) finishDrag(drag, target);
      redraw();
    },
    hover: (pixel) => {
      live.current.hover = pixel ? cellOf(pixel, target.tileset) : null;
      useReadoutStore.getState().setPointer(pixel ? { x: Math.floor(pixel.x), y: Math.floor(pixel.y) } : null);
      redraw();
    },
    cancel: () => {
      live.current.drag = null;
      useTilemapStore.getState().setSelection(null);
      redraw();
    },
  };
};

export { useMapGestures };
