/* @layer renderer-app @kind hook */
import type { PointerEvent, RefObject } from 'react';
import type { Point } from '@bxel/document';
import { heldKeys } from '../../../editor/selection/held-keys';
import { modeOf } from '../../../editor/selection/mode-of';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { selectAtCell } from '../../../tilemap/select-at-cell';
import { MAP_TOOL_OF } from '../../../tilemap/tilemap.constants';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { PixelPoint, PixelViewportHandle } from '../../PixelViewport';
import type { MapGesture, MapLive } from '../TilemapCanvas.type';
import { useGuideGrab } from '../../EditorCanvas/behavior/useGuideGrab';
import { beginDrag } from './begin-drag';
import { cancelMapGesture } from './cancel-map-gesture';
import { cellInSelection } from './cell-in-selection';
import { cellNearest } from './cell-nearest';
import { cellOf } from './cell-of';
import { extendDrag } from './extend-drag';
import { finishDrag } from './finish-drag';
import { placePaste } from './place-paste';

const useMapGestures = (viewport: RefObject<PixelViewportHandle | null>, target: MapTarget, live: RefObject<MapLive>): MapGesture => {
  const tool = MAP_TOOL_OF[useToolStore((state) => state.tool)];
  const pixelAt = (event: PointerEvent<HTMLElement>): PixelPoint => viewport.current?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 };
  const cellAt = (event: PointerEvent<HTMLElement>): Point => cellOf(pixelAt(event), target);
  const cellNear = (event: PointerEvent<HTMLElement>): Point => cellNearest(pixelAt(event), target);
  const spanning = tool === 'rect' || tool === 'select' || tool === 'pick';
  const redraw = (): void => viewport.current?.redraw();
  const guide = useGuideGrab(viewport);
  const begin = (event: PointerEvent<HTMLElement>): void => {
    const store = useTilemapStore.getState();
    const cell = cellAt(event);
    const keys = heldKeys(event);
    if (tool === 'select' && store.selectVariant !== 'rect') {
      selectAtCell(cell, modeOf(keys, store.selectMode));
      return;
    }
    if (tool === 'select' && !keys.shiftKey && store.selectMode === 'replace' && cellInSelection(cell, store.selection)) {
      live.current.drag = { kind: 'move', from: cell, to: cell, copy: keys.altKey };
    } else {
      live.current.drag = beginDrag(tool, spanning ? cellNear(event) : cell, target, modeOf(keys, store.selectMode));
    }
    if (live.current.drag) event.currentTarget.setPointerCapture(event.pointerId);
  };
  return {
    down: (event) => {
      if (guide.down(event)) return;
      live.current.captured = false;
      if (tool === 'zoom') {
        if (event.button === 0) viewport.current?.zoomIn(pixelAt(event));
        if (event.button === 2) viewport.current?.zoomOut(pixelAt(event));
        return;
      }
      if (event.button === 2 && tool === 'place' && !useTilemapStore.getState().paste) {
        const edge = cellNear(event);
        live.current.drag = { kind: 'capture', from: edge, to: edge };
        event.currentTarget.setPointerCapture(event.pointerId);
        return;
      }
      if (event.button !== 0) return;
      if (useTilemapStore.getState().paste) placePaste(cellAt(event));
      else begin(event);
      redraw();
    },
    move: (event) => {
      if (guide.move(event)) return;
      const { drag } = live.current;
      if (drag) live.current.drag = extendDrag(drag, drag.kind === 'stroke' || drag.kind === 'line' ? cellAt(event) : cellNear(event), useTilemapStore.getState().stamp, target);
      live.current.hover = cellAt(event);
      redraw();
    },
    up: () => {
      if (guide.up()) return;
      const { drag } = live.current;
      live.current.drag = null;
      const taken = drag?.kind === 'capture' && (drag.from.x !== drag.to.x || drag.from.y !== drag.to.y);
      if (drag && (drag.kind !== 'capture' || taken)) finishDrag(drag, target);
      live.current.captured = taken;
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
