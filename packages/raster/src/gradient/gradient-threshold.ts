/* @layer core @kind logic */
import type { Point } from '../geometry.type';
import type { DitherGrid } from './gradient-dither.type';
import { HIGH, LOW } from './gradient-threshold.constants';
import type { GradientPattern } from './gradient.type';

const wrapped = (value: number, side: number): number => ((value % side) + side) % side;

const gradientThreshold = (pattern: GradientPattern, grid: DitherGrid, at: Point): number => {
  const { matrix, side } = grid;
  switch (pattern) {
    case 'checker':
      return wrapped(at.x + at.y, 2) === 0 ? LOW : HIGH;
    case 'rows':
      return wrapped(at.y, 2) === 0 ? LOW : HIGH;
    case 'columns':
      return wrapped(at.x, 2) === 0 ? LOW : HIGH;
    case 'bayer':
      return ((matrix[wrapped(at.y, side) * side + wrapped(at.x, side)] ?? 0) + 0.5) / (side * side);
  }
};

export { gradientThreshold };
