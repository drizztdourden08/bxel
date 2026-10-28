/* @layer renderer-app @kind hook */
import type { RgbaImage } from '@bxel/formats';
import { useEffect } from 'react';
import type { RefObject } from 'react';

const usePaintImage = (target: RefObject<HTMLCanvasElement | null>, image: RgbaImage): void => {
  useEffect(() => {
    const element = target.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    element.width = image.width;
    element.height = image.height;
    context.putImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), 0, 0);
  }, [target, image]);
};

export { usePaintImage };
