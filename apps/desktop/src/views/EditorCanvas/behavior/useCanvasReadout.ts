/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import type { PixelDraw, PixelPoint } from '../../PixelViewport';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import type { CanvasReadout } from './canvas-tools.type';

const useCanvasReadout = (): CanvasReadout => {
  const draw = useCallback<PixelDraw>((_ctx, view) => {
    const readout = useReadoutStore.getState();
    if (readout.zoom !== view.zoom) readout.setZoom(view.zoom);
  }, []);
  const onPointerPixel = useCallback((pixel: PixelPoint | null) => useReadoutStore.getState().setPointer(pixel), []);
  return { draw, onPointerPixel };
};

export { useCanvasReadout };
