/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { CanvasTools } from './canvas-tools.type';
import { useAxisDrag } from './useAxisDrag';
import { usePivotDrag } from './usePivotDrag';
import { usePaintGesture } from './usePaintGesture';
import { useSelectGesture } from './useSelectGesture';

const useCanvasTools = (viewport: RefObject<PixelViewportHandle | null>): CanvasTools => {
  const paint = usePaintGesture(viewport);
  const axis = useAxisDrag(viewport);
  const pivot = usePivotDrag(viewport);
  const select = useSelectGesture(viewport);
  return {
    live: paint.live,
    onPointerDown: (event) => {
      if (!pivot.down(event) && !axis.down(event) && !select.down(event)) paint.down(event);
    },
    onPointerMove: (event) => {
      if (!pivot.move(event) && !axis.move(event) && !select.move(event)) paint.move(event);
    },
    onPointerUp: () => {
      if (!pivot.up() && !axis.up() && !select.up()) paint.up();
    },
  };
};

export { useCanvasTools };
