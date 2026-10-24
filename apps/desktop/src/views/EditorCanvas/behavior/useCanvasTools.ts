/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { CanvasTools } from './canvas-tools.type';
import { useAxisDrag } from './useAxisDrag';
import { usePaintGesture } from './usePaintGesture';

const useCanvasTools = (viewport: RefObject<PixelViewportHandle | null>): CanvasTools => {
  const paint = usePaintGesture(viewport);
  const axis = useAxisDrag(viewport);
  return {
    live: paint.live,
    onPointerDown: (event) => {
      if (!axis.down(event)) paint.down(event);
    },
    onPointerMove: (event) => {
      if (!axis.move(event)) paint.move(event);
    },
    onPointerUp: () => {
      if (!axis.up()) paint.up();
    },
    onContextMenu: (event) => event.preventDefault(),
  };
};

export { useCanvasTools };
