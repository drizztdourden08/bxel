/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import type { Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';
import { maskAllows } from '../mask-allows';
import { bayerMatrix } from './bayer-matrix';
import { gradientPick } from './gradient-pick';
import { gradientPosition } from './gradient-position';
import { gradientThreshold } from './gradient-threshold';
import type { GradientOptions } from './gradient.type';
import { seamlessSide } from './seamless-side';

const gradientFill = ({ target, mask, colors, line, bayer, origin, kind, reflect, pattern, wrap }: GradientOptions): Rect | null => {
  const bounds = createBounds();
  const shape = { kind, reflect };
  const style = pattern ?? 'bayer';
  const side = bayer === null ? 1 : seamlessSide(bayer, target, wrap ?? {});
  const matrix = side === 1 ? new Uint8Array(1) : bayerMatrix(side);
  const dithered = bayer !== null && (style !== 'bayer' || side > 1);
  for (const [at, current] of target.pixels.entries()) {
    const x = at % target.width;
    const y = Math.floor(at / target.width);
    if (!maskAllows(mask, x, y)) {
      continue;
    }
    const threshold = dithered ? gradientThreshold(style, matrix, side, x - origin.x, y - origin.y) : null;
    const index = gradientPick({ colors, position: gradientPosition(line, x, y, shape), threshold });
    if (index !== current) {
      target.pixels[at] = index;
      growBounds(bounds, x, y);
    }
  }
  return boundsToRect(bounds);
};

export { gradientFill };
