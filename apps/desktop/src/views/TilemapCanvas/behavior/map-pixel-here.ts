/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import type { PixelViewportHandle } from '../../PixelViewport';

const mapPixelHere = (context: ContextMenuContext, viewport: PixelViewportHandle | null): Point | null => {
  const pixel = viewport?.screenToPixel(context.point.x, context.point.y);
  return pixel ? { x: Math.floor(pixel.x), y: Math.floor(pixel.y) } : null;
};

export { mapPixelHere };
