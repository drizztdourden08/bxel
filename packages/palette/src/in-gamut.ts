/* @layer core @kind logic */
import { GAMUT_EPSILON } from './oklab.constants';
import type { Triple } from './oklab.type';

const inGamut = (linear: Triple): boolean => linear.every((channel) => channel >= -GAMUT_EPSILON && channel <= 1 + GAMUT_EPSILON);

export { inGamut };
