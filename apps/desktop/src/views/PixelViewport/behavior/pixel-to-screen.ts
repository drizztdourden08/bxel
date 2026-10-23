/* @layer renderer-app @kind logic */
import type { PixelPoint } from '../PixelViewport.type';
import type { ViewBox, ViewTarget } from './viewport.type';
import { originOf } from './origin-of';

const pixelToScreen = (pixel: PixelPoint, target: ViewTarget, box: ViewBox): PixelPoint => {
  const origin = originOf(target, box);
  return { x: origin.x + pixel.x * target.zoom, y: origin.y + pixel.y * target.zoom };
};

export { pixelToScreen };
