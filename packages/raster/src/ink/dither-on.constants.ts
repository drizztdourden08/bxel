/* @layer core @kind constants */
import { bayerMatrix } from '../gradient/bayer-matrix';
import { DITHER_SIDE } from './ink.constants';

const BAYER = bayerMatrix(DITHER_SIDE);

export { BAYER };
