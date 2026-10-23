/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { PixelPoint } from '../PixelViewport.type';
import type { ImageSize, PointerPixel, ViewBox, ViewState } from './viewport.type';
import { rootOrigin } from './root-origin';
import { screenToPixel } from './screen-to-pixel';

const inside = (pixel: PixelPoint, image: ImageSize): boolean => pixel.x >= 0 && pixel.y >= 0 && pixel.x < image.width && pixel.y < image.height;

const usePointerPixel = (view: ViewState, box: ViewBox, image: ImageSize, onPointerPixel?: (pixel: PixelPoint | null) => void): PointerPixel => {
  const last = useRef<PixelPoint | null>(null);
  const tell = (pixel: PixelPoint | null) => {
    const before = last.current;
    if (before?.x === pixel?.x && before?.y === pixel?.y) return;
    last.current = pixel;
    onPointerPixel?.(pixel);
  };
  return {
    report: (event) => {
      if (!onPointerPixel) return;
      const origin = rootOrigin(event.currentTarget);
      const pixel = screenToPixel({ x: event.clientX - origin.x, y: event.clientY - origin.y }, view.latest.current, box);
      tell(inside(pixel, image) ? pixel : null);
    },
    clear: () => tell(null),
  };
};

export { usePointerPixel };
