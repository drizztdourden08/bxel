/* @layer core @kind logic */
import { isInside } from '../paths/is-inside';

const findNested = (paths: readonly string[]): readonly [number, number] | undefined => {
  for (let first = 0; first < paths.length; first += 1) {
    for (let second = first + 1; second < paths.length; second += 1) {
      const a = paths[first] ?? '';
      const b = paths[second] ?? '';
      if (isInside(a, b) || isInside(b, a)) return [first, second];
    }
  }
  return undefined;
};

export { findNested };
