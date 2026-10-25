/* @layer renderer-app @kind logic */
import type { PixelPoint } from '../PixelViewport.type';
import type { ViewBox, ViewTarget } from './viewport.type';
import { pixelToScreen } from './pixel-to-screen';

const edgeDelta = (at: number, extent: number, margin: number): number => {
  if (at < margin) return at - margin;
  if (at > extent - margin) return at - (extent - margin);
  return 0;
};

const revealDelta = (pixel: PixelPoint, target: ViewTarget, box: ViewBox): PixelPoint => {
  const centre = pixelToScreen({ x: pixel.x + 0.5, y: pixel.y + 0.5 }, target, box);
  const margin = Math.min(target.zoom, box.width / 4, box.height / 4);
  return { x: edgeDelta(centre.x, box.width, margin) / target.zoom, y: edgeDelta(centre.y, box.height, margin) / target.zoom };
};

export { revealDelta };
