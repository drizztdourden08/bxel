/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { THUMB_BOX } from '../../../sheet/sheet.constants';
import type { FrameImage } from '../../../sheet/sheet.type';
import { drawThumbnail } from './draw-thumbnail';

const useThumbnail = (image: FrameImage | null): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    element.width = THUMB_BOX;
    element.height = THUMB_BOX;
    drawThumbnail(element, image);
  }, [image]);
  return canvas;
};

export { useThumbnail };
