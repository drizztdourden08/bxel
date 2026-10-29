/* @layer renderer-app @kind logic */
import type { Matrix2 } from '@bxel/raster';

const invertMatrix = (m: Matrix2): Matrix2 | null => {
  const det = m[0] * m[3] - m[1] * m[2];
  if (Math.abs(det) < Number.EPSILON) return null;
  return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det];
};

export { invertMatrix };
