/* @layer renderer-app @kind logic */
import type { PixelPoint } from '../PixelViewport.type';
import type { ImageSize, ViewBox } from './viewport.type';

const reachOf = (room: number, margin: number, zoom: number): number => {
  const half = room / 2;
  return (half - Math.min(margin, half)) / zoom;
};

const clampAxis = (pan: number, length: number, reach: number): number => Math.min(length + reach, Math.max(-reach, pan));

const clampPan = (pan: PixelPoint, zoom: number, image: ImageSize, box: ViewBox): PixelPoint => ({
  x: clampAxis(pan.x, image.width, reachOf(box.width, box.margin, zoom)),
  y: clampAxis(pan.y, image.height, reachOf(box.height, box.margin, zoom)),
});

export { clampPan };
