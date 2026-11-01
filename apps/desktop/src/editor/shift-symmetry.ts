/* @layer renderer-app @kind logic */
import type { Point, Symmetry } from '@bxel/raster';

const shiftSymmetry = (symmetry: Symmetry, origin: Point): Symmetry => ({
  ...symmetry,
  ...(typeof symmetry.x2 === 'number' ? { x2: symmetry.x2 + 2 * origin.x } : {}),
  ...(typeof symmetry.y2 === 'number' ? { y2: symmetry.y2 + 2 * origin.y } : {}),
});

export { shiftSymmetry };
