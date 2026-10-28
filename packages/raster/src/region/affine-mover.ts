/* @layer core @kind logic */
import type { ResampleAlgorithm, ResampleOptions } from '../resample/resample.type';
import { affineMatrix, determinant } from './affine-matrix';
import type { AffineSpec } from './affine.type';
import { isExactMatrix } from './is-exact-matrix';
import { pointsArea } from './points-area';
import type { Mover } from './region.type';
import { resampledMover } from './resampled-mover';

/**
 * Scale, skew, turn and move the region about a pivot in one resampling pass.
 * The pivot defaults to the middle of the region. Flips and right angle turns stay exact.
 */
const affineMover = (spec: AffineSpec, algorithm: ResampleAlgorithm = 'nearest', options: ResampleOptions = {}): Mover => {
  const m = affineMatrix(spec);
  const det = determinant(m);
  return resampledMover({
    algorithm: isExactMatrix(m) ? 'nearest' : algorithm,
    options,
    scale: () => 1,
    geometry: ({ box }) => {
      const cx = spec.pivot ? spec.pivot.x2 / 2 : box.x + box.width / 2;
      const cy = spec.pivot ? spec.pivot.y2 / 2 : box.y + box.height / 2;
      const forward = (x: number, y: number) => ({
        x: cx + m[0] * (x - cx) + m[1] * (y - cy) + spec.offset.x,
        y: cy + m[2] * (x - cx) + m[3] * (y - cy) + spec.offset.y,
      });
      const corners = [
        forward(box.x, box.y),
        forward(box.x + box.width, box.y),
        forward(box.x, box.y + box.height),
        forward(box.x + box.width, box.y + box.height),
      ];
      return {
        area: pointsArea(corners),
        inverse: (x, y) => {
          const dx = x + 0.5 - spec.offset.x - cx;
          const dy = y + 0.5 - spec.offset.y - cy;
          return { x: cx + (m[3] * dx - m[1] * dy) / det, y: cy + (-m[2] * dx + m[0] * dy) / det };
        },
      };
    },
  });
};

export { affineMover };
