/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { FrameImage } from '../../../sheet/sheet.type';
import { drawThumbnail } from './draw-thumbnail';

const useImageCanvas = (image: FrameImage | null, box: number): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    element.width = box;
    element.height = box;
    drawThumbnail(element, image, box);
  }, [image, box]);
  return canvas;
};

export { useImageCanvas };
