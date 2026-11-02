/* @layer renderer-app @kind hook */
import { useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import type { PixelDraw, PixelPoint, PixelViewportHandle } from '../../PixelViewport';
import { useAssetViewStore } from '../../../stores/useAssetViewStore';
import { useReferenceStore } from '../../../stores/useReferenceStore';
import { useAssistantPresenceStore } from '../../../stores/useAssistantPresenceStore';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { useMarkerStore } from '../../../stores/useMarkerStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { CanvasReadout } from './canvas-tools.type';
import { paintOverlay } from './paint-overlay';

const useCanvasReadout = (viewport: RefObject<PixelViewportHandle | null>): CanvasReadout => {
  const draw = useCallback<PixelDraw>((ctx, view) => {
    const readout = useReadoutStore.getState();
    if (readout.zoom !== view.zoom) readout.setZoom(view.zoom);
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
  useEffect(() => useAssetViewStore.subscribe(() => viewport.current?.redraw()), [viewport]);
  useEffect(() => useReferenceStore.subscribe(() => viewport.current?.redraw()), [viewport]);
  useEffect(() => useMarkerStore.subscribe(() => viewport.current?.redraw()), [viewport]);
  useEffect(() => useAssistantPresenceStore.subscribe(() => viewport.current?.redraw()), [viewport]);
  useEffect(() => useViewStore.subscribe((state, before) => { if (state.hideOverlays !== before.hideOverlays) viewport.current?.redraw(); }), [viewport]);
  return { draw, onPointerPixel };
};

export { useCanvasReadout };
