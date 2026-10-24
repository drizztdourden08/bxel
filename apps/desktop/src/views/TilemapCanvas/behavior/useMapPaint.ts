/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { PixelDraw, PixelViewportHandle } from '../../PixelViewport';
import type { MapLive, MapPaintBase } from '../TilemapCanvas.type';
import { mapLook } from './map-look';
import { paintCellGrid } from './paint-cell-grid';
import { paintCollision } from './paint-collision';
import { paintDrag } from './paint-drag';
import { paintHover } from './paint-hover';
import { paintSelection } from './paint-selection';
import { syncZoom } from './sync-zoom';

const useMapPaint = (base: MapPaintBase, live: RefObject<MapLive>, viewport: RefObject<PixelViewportHandle | null>): PixelDraw => {
  const props = useRef(base);
  useLayoutEffect(() => {
    props.current = base;
  }, [base]);
  useEffect(() => {
    viewport.current?.redraw();
  }, [base, viewport]);
  return useCallback<PixelDraw>(
    (ctx, view) => {
      syncZoom(view.zoom);
      const state = { ...props.current, live: live.current };
      const look = mapLook(ctx.canvas);
      paintCellGrid(ctx, view, state);
      paintCollision(ctx, state, look);
      paintSelection(ctx, view, state, look);
      paintDrag(ctx, view, state, look);
      paintHover(ctx, view, state, look);
    },
    [live],
  );
};

export { useMapPaint };
