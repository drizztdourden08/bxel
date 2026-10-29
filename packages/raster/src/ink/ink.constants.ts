/* @layer core @kind config */
import type { DitherPattern } from './ink.type';

const DITHER_PATTERNS = ['checker', 'bayer', 'rows', 'columns', 'dots'] as const satisfies readonly DitherPattern[];
const DITHER_LEVEL_MAX = 15;
const DITHER_LEVEL_DEFAULT = 8;
const DITHER_SIDE = 4;
const INK_STEPS_MAX = 255;

export { DITHER_LEVEL_DEFAULT, DITHER_LEVEL_MAX, DITHER_PATTERNS, DITHER_SIDE, INK_STEPS_MAX };
