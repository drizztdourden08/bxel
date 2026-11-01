/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import type { Point } from '@bxel/raster';
import { useCursorRelease } from '../../../hooks/useCursorRelease';
import { springKeyDown } from '../../../editor/tool-pick/spring-key-down';
import { springKeyUp } from '../../../editor/tool-pick/spring-key-up';
import type { PixelViewportHandle } from '../../PixelViewport';
import { canvasKey } from './canvas-key';
import type { CanvasKeys } from './canvas-tools.type';

const useCanvasKeys = (viewport: RefObject<PixelViewportHandle | null>): CanvasKeys => {
  const active = useRef(false);
  const anchor = useRef<Point | null>(null);
  const points = useRef<Point[]>([]);
  const release = useCursorRelease(active, () => {
    anchor.current = null;
    points.current = [];
  });
  return {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      springKeyDown(event);
      canvasKey(event, { viewport, active, anchor, points });
    },
    onKeyUp: (event: KeyboardEvent<HTMLElement>) => springKeyUp(event.key),
    onPointerPixel: release.onPointerPixel,
    onBlur: (event) => {
      springKeyUp();
      release.onBlur(event);
    },
  };
};

export { useCanvasKeys };
