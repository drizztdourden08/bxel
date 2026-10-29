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
import { useGuideGrab } from '../../EditorCanvas/behavior/useGuideGrab';
import { useZoomGesture } from '../../EditorCanvas/behavior/useZoomGesture';
import { beginMapPress } from './begin-map-press';
import { cancelMapGesture } from './cancel-map-gesture';
import { cellNearest } from './cell-nearest';
import { cellOf } from './cell-of';
import { extendDrag } from './extend-drag';
import { finishDrag } from './finish-drag';
import { releaseMapDrag } from './release-map-drag';
import { snapCell } from './snap-cell';

const useMapGestures = (viewport: RefObject<PixelViewportHandle | null>, target: MapTarget, live: RefObject<MapLive>): MapGesture => {
  const tool = MAP_TOOL_OF[useToolStore((state) => state.tool)];
  const pixelAt = (event: PointerEvent<HTMLElement>): PixelPoint => viewport.current?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 };
  const cellAt = (event: PointerEvent<HTMLElement>): Point => cellOf(pixelAt(event), target);
  const cellNear = (event: PointerEvent<HTMLElement>, from: Point | null = null): Point =>
    snapCell(viewport.current, pixelAt(event), { cell: cellNearest(pixelAt(event), target), from }, target);
  const redraw = (): void => viewport.current?.redraw();
  const guide = useGuideGrab(viewport);
  const zoom = useZoomGesture(viewport);
  return {
    down: (event) => {
      if (guide.down(event) || zoom.down(event)) return;
      beginMapPress(event, { viewport, tool, target, live, cells: { here: cellAt(event), near: cellNear(event) } });
      redraw();
    },
    move: (event) => {
      if (guide.move(event) || zoom.move(event)) return;
      const { drag } = live.current;
      if (drag) live.current.drag = extendDrag(drag, drag.kind === 'stroke' || drag.kind === 'line' ? cellAt(event) : cellNear(event, drag.from), useTilemapStore.getState().stamp, target);
      live.current.hover = cellAt(event);
      redraw();
    },
    up: () => {
      if (guide.up() || zoom.up()) return;
      releaseMapDrag(live, (drag) => finishDrag(drag, target));
      redraw();
    },
    hover: (pixel) => {
      live.current.hover = pixel ? cellOf(pixel, target) : null;
      useReadoutStore.getState().setPointer(pixel ? { x: Math.floor(pixel.x), y: Math.floor(pixel.y) } : null);
      redraw();
    },
    cancel: () => {
      cancelMapGesture(live);
      redraw();
    },
  };
};

export { useMapGestures };
