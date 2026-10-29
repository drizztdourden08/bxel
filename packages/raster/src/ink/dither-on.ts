/* @layer core @kind logic */
import { BAYER } from './dither-on.constants';
import { DITHER_SIDE } from './ink.constants';
import type { DitherPattern } from './ink.type';

const wrapped = (value: number, side: number): number => ((value % side) + side) % side;

const ditherOn = (pattern: DitherPattern, level: number, x: number, y: number): boolean => {
  switch (pattern) {
    case 'checker':
      return wrapped(x + y, 2) === 0;
    case 'rows':
      return wrapped(y, 2) === 0;
    case 'columns':
      return wrapped(x, 2) === 0;
    case 'dots':
      return wrapped(x, 2) === 0 && wrapped(y, 2) === 0;
    case 'bayer':
      return (BAYER[wrapped(y, DITHER_SIDE) * DITHER_SIDE + wrapped(x, DITHER_SIDE)] ?? 0) < level;
  }
};

export { ditherOn };
