/* @layer renderer-app @kind hook */
import { useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import type { PixelDraw, PixelPoint, PixelViewportHandle } from '../../PixelViewport';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { CanvasReadout } from './canvas-tools.type';
import { paintOverlay } from './paint-overlay';
import { publishRuler } from './publish-ruler';

const useCanvasReadout = (viewport: RefObject<PixelViewportHandle | null>): CanvasReadout => {
  const draw = useCallback<PixelDraw>((ctx, view) => {
    const readout = useReadoutStore.getState();
    if (readout.zoom !== view.zoom) readout.setZoom(view.zoom);
    publishRuler(view);
    paintOverlay(ctx, view);
  }, []);
  const onPointerPixel = useCallback(
    (pixel: PixelPoint | null) => {
      useReadoutStore.getState().setPointer(pixel);
      viewport.current?.redraw();
    },
    [viewport],
  );
  useEffect(() => useToolStore.subscribe(() => viewport.current?.redraw()), [viewport]);
  useEffect(() => useTimelineStore.subscribe(() => viewport.current?.redraw()), [viewport]);
  return { draw, onPointerPixel };
};

export { useCanvasReadout };
