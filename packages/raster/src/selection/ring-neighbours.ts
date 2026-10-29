/* @layer core @kind logic */
import type { Connectivity } from '../fill.type';
import { CROSS_STEPS, SQUARE_STEPS } from './selection.constants';

const ringNeighbours = (connectivity: Connectivity): readonly (readonly [number, number])[] => (connectivity === 8 ? SQUARE_STEPS : CROSS_STEPS);

export { ringNeighbours };
