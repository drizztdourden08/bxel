/* @layer core @kind logic */
import type { AnimDirection } from '../model/animation.type';

const range = (first: number, last: number): number[] =>
  first <= last
    ? Array.from({ length: last - first + 1 }, (_, step) => first + step)
    : Array.from({ length: first - last + 1 }, (_, step) => first - step);

const inside = (first: number, last: number): number[] => (last - first >= 2 ? range(last - 1, first + 1) : []);

const playOrder = (first: number, last: number, direction: AnimDirection): readonly number[] => {
  switch (direction) {
    case 'forward':
      return range(first, last);
    case 'reverse':
      return range(last, first);
    case 'pingpong':
      return [...range(first, last), ...inside(first, last)];
    case 'pingpongReverse':
      return [...range(last, first), ...inside(first, last).reverse()];
  }
};

export { playOrder };
