/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { CanvasTools } from './canvas-tools.type';
import { useAxisDrag } from './useAxisDrag';
import { usePaintGesture } from './usePaintGesture';
import { useSelectGesture } from './useSelectGesture';

const useCanvasTools = (viewport: RefObject<PixelViewportHandle | null>): CanvasTools => {
  const paint = usePaintGesture(viewport);
  const axis = useAxisDrag(viewport);
  const select = useSelectGesture(viewport);
  return {
    live: paint.live,
    onPointerDown: (event) => {
      if (!axis.down(event) && !select.down(event)) paint.down(event);
    },
    onPointerMove: (event) => {
      if (!axis.move(event) && !select.move(event)) paint.move(event);
    },
    onPointerUp: () => {
      if (!axis.up() && !select.up()) paint.up();
    },
  };
};

export { useCanvasTools };
