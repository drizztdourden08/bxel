/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { CanvasTools } from './canvas-tools.type';
import { useAxisDrag } from './useAxisDrag';
import { useBrushResizeGesture } from './useBrushResizeGesture';
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
  const guide = useGuideGrab(viewport);
  const axis = useAxisDrag(viewport);
  const pivot = usePivotDrag(viewport);
  const mask = useQuickMaskGesture(viewport);
  const select = useSelectGesture(viewport);
  const zoom = useZoomGesture(viewport);
  const slice = useSliceGesture(viewport);
  const transform = useTransformGesture(viewport);
  const resize = useBrushResizeGesture(viewport);
  return {
    live: paint.live,
    onPointerDown: (event) => {
      if (!guide.down(event) && !pivot.down(event) && !axis.down(event) && !transform.down(event) && !zoom.down(event) && !slice.down(event) && !mask.down(event) && !resize.down(event) && !select.down(event)) paint.down(event);
    },
    onPointerMove: (event) => {
      if (!guide.move(event) && !pivot.move(event) && !axis.move(event) && !transform.move(event) && !zoom.move(event) && !slice.move(event) && !mask.move(event) && !resize.move(event) && !select.move(event)) paint.move(event);
    },
    onPointerUp: () => {
      if (!guide.up() && !pivot.up() && !axis.up() && !transform.up() && !zoom.up() && !slice.up() && !mask.up() && !resize.up() && !select.up()) paint.up();
    },
  };
};

export { useCanvasTools };
