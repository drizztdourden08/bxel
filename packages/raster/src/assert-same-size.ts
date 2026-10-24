/* @layer core @kind logic */
import type { Size } from './geometry.type';

const assertSameSize = (first: Size, second: Size): void => {
  if (first.width !== second.width || first.height !== second.height) {
    throw new RangeError(`Size ${first.width}x${first.height} does not match ${second.width}x${second.height}.`);
  }
};

export { assertSameSize };
