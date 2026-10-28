/* @layer core @kind logic */
import type { ResampleAlgorithm, ResampleOptions } from '../resample/resample.type';
import { resampledMover } from './resampled-mover';
import type { Mover } from './region.type';
import { rotatedBox } from './rotated-box';
import { rotationTerms } from './rotation-terms';
import { RIGHT_ANGLE_DEGREES } from './region.constants';

const exactAngle = (degrees: number): boolean => degrees % RIGHT_ANGLE_DEGREES === 0;

const rotateMover = (degrees: number, algorithm: ResampleAlgorithm = 'nearest', options: ResampleOptions = {}): Mover =>
  resampledMover({
    algorithm: exactAngle(degrees) ? 'nearest' : algorithm,
    options,
    scale: () => 1,
    geometry: ({ box, pivot }) => {
      const terms = rotationTerms(degrees);
      const centerX = pivot.x2 / 2;
      const centerY = pivot.y2 / 2;
      return {
        area: rotatedBox(box, pivot, terms),
        inverse: (x, y) => {
          const dx = x + 0.5 - centerX;
          const dy = y + 0.5 - centerY;
          return { x: centerX + terms.cos * dx + terms.sin * dy, y: centerY - terms.sin * dx + terms.cos * dy };
        },
      };
    },
  });

export { rotateMover };
