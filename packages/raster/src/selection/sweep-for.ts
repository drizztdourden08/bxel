/* @layer core @kind logic */
import type { Size } from '../geometry.type';
import type { Sweep, SweepAxis } from './selection.type';

const sweepFor = (axis: SweepAxis, { width, height }: Size): Sweep =>
  axis === 'row'
    ? { lines: height, length: width, lineStep: width, step: 1 }
    : { lines: width, length: height, lineStep: 1, step: width };

export { sweepFor };
