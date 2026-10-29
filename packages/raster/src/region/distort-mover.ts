/* @layer core @kind logic */
import type { ResampleAlgorithm, ResampleOptions } from '../resample/resample.type';
import type { Quad } from './affine.type';
import { quadInverse } from './homography';
import { pointsArea } from './points-area';
import type { Mover } from './region.type';
import { resampledMover } from './resampled-mover';

const distortMover = (corners: Quad, algorithm: ResampleAlgorithm = 'nearest', options: ResampleOptions = {}): Mover =>
  resampledMover({
    algorithm,
    options,
    scale: () => 1,
    geometry: ({ box }) => {
      const inverse = quadInverse(corners, box);
      return { area: pointsArea(corners), inverse: (x, y) => inverse(x + 0.5, y + 0.5) };
    },
  });

export { distortMover };
