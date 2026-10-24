/* @layer core @kind logic */
import type { Bounds } from '../bounds.type';
import { growBounds } from '../grow-bounds';
import { maskAllows } from '../mask-allows';
import type { StampPlace } from './stamp.type';

const stampOnce = ({ options, origin }: StampPlace, bounds: Bounds): void => {
  const { target, patch, skipZero, mask } = options;
  for (const [at, value] of patch.pixels.entries()) {
    const x = origin.x + (at % patch.width);
    const y = origin.y + Math.floor(at / patch.width);
    const inside = x >= 0 && y >= 0 && x < target.width && y < target.height;
    if (inside && !(skipZero && value === 0) && maskAllows(mask, x, y) && target.pixels[y * target.width + x] !== value) {
      target.pixels[y * target.width + x] = value;
      growBounds(bounds, x, y);
    }
  }
};

export { stampOnce };
