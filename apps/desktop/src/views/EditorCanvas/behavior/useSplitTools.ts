/* @layer renderer-app @kind hook */
import { useMemo, useRef } from 'react';
import { useCanvasTools } from './useCanvasTools';
import type { SplitTools, ViewHandlers, ViewportRef } from './useSplitTools.type';

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
