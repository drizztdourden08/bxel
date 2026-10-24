/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import type { Rect } from '../geometry.type';
import { stampOnce } from './stamp-once';
import type { StampOptions } from './stamp.type';

const stampPatch = (options: StampOptions): Rect | null => {
  const bounds = createBounds();
  const anchor = options.anchor ?? { x: Math.floor(options.patch.width / 2), y: Math.floor(options.patch.height / 2) };
  for (const point of options.points) {
    stampOnce({ options, origin: { x: point.x - anchor.x, y: point.y - anchor.y } }, bounds);
  }
  return boundsToRect(bounds);
};

export { stampPatch };
