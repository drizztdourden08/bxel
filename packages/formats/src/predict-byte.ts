/* @layer core @kind logic */
import { PNG_FILTER } from './png-filter.constants';

const paeth = (a: number, b: number, c: number): number => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
};

const predictByte = (type: number, a: number, b: number, c: number): number => {
  switch (type) {
    case PNG_FILTER.SUB:
      return a;
    case PNG_FILTER.UP:
      return b;
    case PNG_FILTER.AVERAGE:
      return (a + b) >> 1;
    case PNG_FILTER.PAETH:
      return paeth(a, b, c);
    default:
      return 0;
  }
};

export { predictByte };
