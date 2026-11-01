/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import type { Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';
import { maskAllows } from '../mask-allows';
import { gradientDither } from './gradient-dither';
import { gradientPick } from './gradient-pick';
import { gradientPosition } from './gradient-position';
import { gradientThreshold } from './gradient-threshold';
import type { GradientOptions } from './gradient.type';

const gradientFill = (options: GradientOptions): Rect | null => {
  const { target, mask, colors, line, origin, kind, reflect } = options;
  const bounds = createBounds();
  const shape = { kind, reflect };
  const dither = gradientDither(options);
  for (const [at, current] of target.pixels.entries()) {
    const x = at % target.width;
    const y = Math.floor(at / target.width);
    if (!maskAllows(mask, x, y)) {
      continue;
    }
    const threshold = dither ? gradientThreshold(dither.style, dither.grid, { x: x - origin.x, y: y - origin.y }, dither.stencil) : null;
    const index = gradientPick({ colors, position: gradientPosition(line, x, y, shape), threshold });
    if (index !== current) {
      target.pixels[at] = index;
      growBounds(bounds, x, y);
    }
  }
  return boundsToRect(bounds);
};

export { gradientFill };
