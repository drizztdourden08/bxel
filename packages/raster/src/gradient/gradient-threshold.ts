/* @layer core @kind logic */
import type { GradientPattern } from './gradient.type';

const LOW = 0.25;
const HIGH = 0.75;

const wrapped = (value: number, side: number): number => ((value % side) + side) % side;

const gradientThreshold = (pattern: GradientPattern, matrix: Uint8Array, side: number, x: number, y: number): number => {
  switch (pattern) {
    case 'checker':
      return wrapped(x + y, 2) === 0 ? LOW : HIGH;
    case 'rows':
      return wrapped(y, 2) === 0 ? LOW : HIGH;
    case 'columns':
      return wrapped(x, 2) === 0 ? LOW : HIGH;
    case 'bayer':
      return ((matrix[wrapped(y, side) * side + wrapped(x, side)] ?? 0) + 0.5) / (side * side);
  }
};

export { gradientThreshold };
