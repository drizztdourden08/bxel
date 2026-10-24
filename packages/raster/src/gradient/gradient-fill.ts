/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import type { Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';
import { maskAllows } from '../mask-allows';
import { bayerMatrix } from './bayer-matrix';
import { gradientPick } from './gradient-pick';
import { gradientPosition } from './gradient-position';
import type { GradientOptions } from './gradient.type';

const thresholdAt = (matrix: Uint8Array | null, side: number, x: number, y: number): number | null => {
  if (!matrix) {
    return null;
  }
  const column = ((x % side) + side) % side;
  const row = ((y % side) + side) % side;
  return ((matrix[row * side + column] ?? 0) + 0.5) / (side * side);
};

const gradientFill = ({ target, mask, colors, line, bayer, origin }: GradientOptions): Rect | null => {
  const bounds = createBounds();
  const matrix = bayer === null ? null : bayerMatrix(bayer);
  for (const [at, current] of target.pixels.entries()) {
    const x = at % target.width;
    const y = Math.floor(at / target.width);
    if (!maskAllows(mask, x, y)) {
      continue;
    }
    const threshold = thresholdAt(matrix, bayer ?? 1, x - origin.x, y - origin.y);
    const index = gradientPick({ colors, position: gradientPosition(line, x, y), threshold });
    if (index !== current) {
      target.pixels[at] = index;
      growBounds(bounds, x, y);
    }
  }
  return boundsToRect(bounds);
};

export { gradientFill };
