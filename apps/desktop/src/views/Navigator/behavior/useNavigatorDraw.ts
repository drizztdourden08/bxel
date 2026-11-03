/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import type { PixelSource } from '../../PixelViewport';
import type { ThumbSize } from '../Navigator.type';
import { paintThumb } from './paint-thumb';

const isStill = (source: PixelSource): boolean => 'data' in source && 'colorSpace' in source;

const useNavigatorDraw = (canvas: RefObject<HTMLCanvasElement | null>, thumb: ThumbSize | null): void => {
  const lastSource = useRef<PixelSource | undefined>(undefined);
  const scratch = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    lastSource.current = undefined;
    const draw = () => {
      const { source } = useViewFeedStore.getState();
      const target = canvas.current;
      if (!thumb || !target || !source || (source === lastSource.current && isStill(source))) return;
      paintThumb(target, source, thumb, () => (scratch.current ??= target.ownerDocument.createElement('canvas')));
      lastSource.current = source;
    };
    draw();
    return useViewFeedStore.subscribe(draw);
  }, [canvas, thumb]);
};

export { useNavigatorDraw };
