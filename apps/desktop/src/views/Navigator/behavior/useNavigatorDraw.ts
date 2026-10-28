/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import type { PixelRect, PixelSource } from '../../PixelViewport';
import type { ThumbSize } from '../Navigator.type';
import { clipRect } from './clip-rect';
import { paintThumb } from './paint-thumb';
import { place } from './place-box';
import { visibleRect } from './visible-rect';

interface NavigatorParts {
  canvas: RefObject<HTMLCanvasElement | null>;
  frame: RefObject<HTMLElement | null>;
  mark: RefObject<HTMLElement | null>;
}

const isStill = (source: PixelSource): boolean => 'data' in source && 'colorSpace' in source;

const useNavigatorDraw = (parts: NavigatorParts, thumb: ThumbSize | null, selection: PixelRect | null): void => {
  const lastSource = useRef<PixelSource | undefined>(undefined);
  const scratch = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    lastSource.current = undefined;
    const draw = () => {
      const { view, source } = useViewFeedStore.getState();
      const canvas = parts.canvas.current;
      if (!thumb || !view || !canvas) {
        place(parts.frame.current, null, 1);
        place(parts.mark.current, null, 1);
        return;
      }
      if (source && !(source === lastSource.current && isStill(source))) {
        paintThumb(canvas, source, thumb, () => (scratch.current ??= canvas.ownerDocument.createElement('canvas')));
        lastSource.current = source;
      }
      place(parts.frame.current, clipRect(visibleRect(view), view), thumb.scale);
      place(parts.mark.current, selection, thumb.scale);
    };
    draw();
    return useViewFeedStore.subscribe(draw);
  }, [parts, thumb, selection]);
};

export type { NavigatorParts };
export { useNavigatorDraw };
