/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import type { Point } from '@bxel/raster';
import { useCursorRelease } from '../../../hooks/useCursorRelease';
import type { PixelViewportHandle } from '../../PixelViewport';
import { canvasKey } from './canvas-key';
import type { CanvasKeys } from './canvas-tools.type';

const useCanvasKeys = (viewport: RefObject<PixelViewportHandle | null>): CanvasKeys => {
  const active = useRef(false);
  const anchor = useRef<Point | null>(null);
  const release = useCursorRelease(active, () => {
    anchor.current = null;
  });
  return {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => canvasKey(event, { viewport, active, anchor }),
    ...release,
  };
};

export { useCanvasKeys };
