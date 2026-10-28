/* @layer renderer-app @kind logic */
import type { Quad, Rect } from '@bxel/raster';

/** Top left, top right, bottom right, bottom left. */
const boxCorners = (box: Rect): Quad => [
  { x: box.x, y: box.y },
  { x: box.x + box.width, y: box.y },
  { x: box.x + box.width, y: box.y + box.height },
  { x: box.x, y: box.y + box.height },
];

export { boxCorners };
