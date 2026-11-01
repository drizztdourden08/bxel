/* @layer renderer-app @kind hook */
import { useMemo, useRef } from 'react';
import type { PointerEvent, RefObject } from 'react';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { CanvasTools } from './canvas-tools.type';
import { useCanvasTools } from './useCanvasTools';

type ViewportRef = RefObject<PixelViewportHandle | null>;

interface ViewHandlers {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
}

interface SplitTools {
  live: CanvasTools['live'];
  forView: (view: ViewportRef) => ViewHandlers;
}

const useSplitTools = (primary: ViewportRef): SplitTools => {
  const active = useRef<ViewportRef>(primary);
  const proxy = useMemo<ViewportRef>(() => ({ get current() { return active.current.current; } }), []);
  const tools = useCanvasTools(proxy);
  const forView = (view: ViewportRef): ViewHandlers => ({
    onPointerDown: (event) => {
      active.current = view;
      tools.onPointerDown(event);
    },
    onPointerMove: (event) => {
      active.current = view;
      tools.onPointerMove(event);
    },
    onPointerUp: () => tools.onPointerUp(),
  });
  return { live: tools.live, forView };
};

export { useSplitTools };
