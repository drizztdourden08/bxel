/* @layer core @kind config */
import type { Brush } from './brush.type';

const BRUSH_SIZE_MIN = 1;
const BRUSH_SIZE_MAX = 64;
const DEFAULT_BRUSH: Brush = { shape: 'square', size: 1 };

export { BRUSH_SIZE_MAX, BRUSH_SIZE_MIN, DEFAULT_BRUSH };
