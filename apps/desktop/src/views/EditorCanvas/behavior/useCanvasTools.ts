/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { AxisDrag, CanvasTools } from './canvas-tools.type';
import { useAxisDrag } from './useAxisDrag';
import { useBrushResizeGesture } from './useBrushResizeGesture';
import { useGradientOriginDrag } from './useGradientOriginDrag';
import { useGuideGrab } from './useGuideGrab';
import { usePivotDrag } from './usePivotDrag';
import { usePaintGesture } from './usePaintGesture';
import { useQuickMaskGesture } from './useQuickMaskGesture';
import { useSelectGesture } from './useSelectGesture';
import { useSliceGesture } from './useSliceGesture';
import { useZoomGesture } from './useZoomGesture';
import { useTransformGesture } from './useTransformGesture';

const useCanvasTools = (viewport: RefObject<PixelViewportHandle | null>): CanvasTools => {
  const paint = usePaintGesture(viewport);
  const origin = useGradientOriginDrag(viewport);
  const guide = useGuideGrab(viewport);
  const axis = useAxisDrag(viewport);
  const pivot = usePivotDrag(viewport);
  const mask = useQuickMaskGesture(viewport);
  const select = useSelectGesture(viewport);
  const zoom = useZoomGesture(viewport);
  const slice = useSliceGesture(viewport);
  const transform = useTransformGesture(viewport);
  const resize = useBrushResizeGesture(viewport);
  const chain: AxisDrag[] = [origin, guide, pivot, axis, transform, zoom, slice, mask, resize, select];
  return {
    live: paint.live,
    onPointerDown: (event) => {
      if (!chain.some((gesture) => gesture.down(event))) paint.down(event);
    },
    onPointerMove: (event) => {
      if (!chain.some((gesture) => gesture.move(event))) paint.move(event);
    },
    onPointerUp: () => {
      if (!chain.some((gesture) => gesture.up())) paint.up();
    },
  };
};

export { useCanvasTools };
