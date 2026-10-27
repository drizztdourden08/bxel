/* @layer renderer-app @kind hook */
import { useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import type { Ref } from 'react';
import type { PixelPoint, PixelViewportHandle } from '../PixelViewport.type';
import type { ViewportParts } from './viewport.type';
import { pixelToScreen } from './pixel-to-screen';
import { revealDelta } from './reveal-delta';
import { rootOrigin } from './root-origin';
import { screenToPixel } from './screen-to-pixel';
import { viewOf } from './view-of';

const useViewportHandle = (ref: Ref<PixelViewportHandle> | undefined, parts: ViewportParts, redraw: () => void): PixelViewportHandle => {
  const live = useRef(parts);
  useLayoutEffect(() => {
    live.current = parts;
  });
  const handle = useMemo<PixelViewportHandle>(() => {
    const local = (client?: PixelPoint): PixelPoint | undefined => {
      if (!client) return undefined;
      const origin = rootOrigin(live.current.rootRef.current);
      return { x: client.x - origin.x, y: client.y - origin.y };
    };
    const target = () => live.current.view.latest.current;
    return {
      screenToPixel: (clientX, clientY) => screenToPixel(local({ x: clientX, y: clientY }) ?? { x: 0, y: 0 }, target(), live.current.box),
      pixelToScreen: (x, y) => {
        const origin = rootOrigin(live.current.rootRef.current);
        const at = pixelToScreen({ x, y }, target(), live.current.box);
        return { x: at.x + origin.x, y: at.y + origin.y };
      },
      fit: () => live.current.view.fit(),
      setZoom: (zoom, anchor) => live.current.view.zoomTo(zoom, local(anchor)),
      zoomIn: (anchor) => live.current.view.zoomStep(1, local(anchor)),
      zoomOut: (anchor) => live.current.view.zoomStep(-1, local(anchor)),
      redraw,
      reveal: (pixel) => {
        const delta = revealDelta(pixel, target(), live.current.box);
        if (delta.x !== 0 || delta.y !== 0) live.current.view.panBy(delta.x, delta.y);
      },
      panTo: (pixel) => live.current.view.apply({ zoom: target().zoom, pan: pixel }),
      view: () => viewOf(target(), live.current.box, live.current.image),
    };
  }, [redraw]);
  useImperativeHandle(ref, () => handle, [handle]);
  return handle;
};

export { useViewportHandle };
