/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import type { PixelDraw, PixelViewportHandle } from '../../PixelViewport';
import type { SheetDrag, SheetPaintBase } from '../SheetCanvas.type';
import { overlayLook } from '../../EditorCanvas/behavior/overlay-look';
import { paintGuides } from '../../EditorCanvas/behavior/paint-guides';
import { paintFrames } from './paint-frames';
import { paintPicks } from './paint-picks';
import { paintSlices } from './paint-slices';
import { sheetLook } from './sheet-look';

const useSheetPaint = (base: SheetPaintBase, drag: RefObject<SheetDrag | null>, viewport: RefObject<PixelViewportHandle | null>): PixelDraw => {
  const latest = useRef(base);
  useEffect(() => {
    latest.current = base;
    viewport.current?.redraw();
  }, [base, viewport]);
  return useCallback<PixelDraw>(
    (ctx, view) => {
      const readout = useReadoutStore.getState();
      if (readout.zoom !== view.zoom) readout.setZoom(view.zoom);
      const look = sheetLook(ctx.canvas);
      const state = { ...latest.current, drag: drag.current };
      paintFrames(ctx, view, state, look);
      paintSlices(ctx, view, state, look);
      paintPicks(ctx, view, state, look);
      paintGuides(ctx, view, overlayLook(ctx.canvas));
    },
    [drag],
  );
};

export { useSheetPaint };
