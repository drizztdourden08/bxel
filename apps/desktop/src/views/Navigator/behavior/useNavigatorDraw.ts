/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import type { PixelRect, PixelSource } from '../../PixelViewport';
import type { ThumbSize } from '../Navigator.type';
import type { NavigatorParts } from './useNavigatorDraw.type';
import { paintThumb } from './paint-thumb';
import { place } from './place-box';
import { shownRect } from './shown-rect';

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
      place(parts.frame.current, shownRect(view), thumb.scale);
      place(parts.mark.current, selection, thumb.scale);
    };
    draw();
    return useViewFeedStore.subscribe(draw);
  }, [parts, thumb, selection]);
};

export { useNavigatorDraw };
