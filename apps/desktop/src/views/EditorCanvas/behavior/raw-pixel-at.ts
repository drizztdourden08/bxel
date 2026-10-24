/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint } from './canvas-tools.type';

const rawPixelAt = (viewport: PixelViewportHandle | null, event: ClientPoint): Point => {
  const at = viewport?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 };
  return { x: Math.floor(at.x), y: Math.floor(at.y) };
};

export { rawPixelAt };
