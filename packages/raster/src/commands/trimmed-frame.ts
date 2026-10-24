/* @layer core @kind logic */
import type { Rect, Sprite } from '@bxel/document';
import { opaqueExtent } from '../region/opaque-extent';

const trimmedFrame = (sprite: Sprite): Rect | null => {
  const sources = Object.values(sprite.cels).map((cel) => ({ pixels: cel.pixels, width: sprite.width, height: sprite.height }));
  const extent = opaqueExtent(sources);
  if (!extent) return null;
  const frame = { x: extent.x0, y: extent.y0, width: extent.x1 - extent.x0 + 1, height: extent.y1 - extent.y0 + 1 };
  return frame.width === sprite.width && frame.height === sprite.height ? null : frame;
};

export { trimmedFrame };
