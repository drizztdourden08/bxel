/* @layer core @kind logic */
import type { SheetTagDirection } from './sheet-metadata.type';

const run = (first: number, last: number): number[] =>
  Array.from({ length: last - first + 1 }, (_, step) => first + step);

const inside = (first: number, last: number): number[] => (last - first >= 2 ? run(first + 1, last - 1) : []);

const tagPlayOrder = (first: number, last: number, direction: SheetTagDirection): number[] => {
  switch (direction) {
    case 'forward':
      return run(first, last);
    case 'reverse':
      return run(first, last).reverse();
    case 'pingpong':
      return [...run(first, last), ...inside(first, last).reverse()];
    case 'pingpongReverse':
      return [...run(first, last).reverse(), ...inside(first, last)];
  }
};

export { tagPlayOrder };
