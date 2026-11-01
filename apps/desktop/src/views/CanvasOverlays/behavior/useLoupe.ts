/* @layer renderer-app @kind hook */
import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelSource, PixelViewportHandle } from '../../PixelViewport';
import { loupePlace } from './loupe-place';
import { paintLoupe } from './paint-loupe';

const useLoupe = (host: RefObject<HTMLElement | null>, viewport: RefObject<PixelViewportHandle | null>, source: PixelSource | undefined): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const on = useViewStore((state) => state.loupe);
  const pointer = useReadoutStore((state) => state.pointer);
  const zoom = useReadoutStore((state) => state.zoom);
  useLayoutEffect(() => {
    const element = canvas.current;
    const handle = viewport.current;
    const room = host.current?.getBoundingClientRect();
    if (!on || !element || !handle || !room || !source || pointer === null) {
      if (element) element.hidden = true;
      return;
    }
    const centre = handle.pixelToScreen(pointer.x + 0.5, pointer.y + 0.5);
    const place = loupePlace({ x: centre.x - room.left, y: centre.y - room.top }, room);
    element.hidden = false;
    element.style.left = `${place.x}px`;
    element.style.top = `${place.y}px`;
    paintLoupe(element, source, pointer, zoom);
  }, [on, pointer, zoom, source, viewport, host]);
  return canvas;
};

export { useLoupe };
