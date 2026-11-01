/* @layer core @kind config */
import type { Brush } from './brush.type';

const BRUSH_SIZE_MIN = 1;
const BRUSH_SIZE_MAX = 64;
const BRUSH_SPACING_MIN = 1;
const BRUSH_SPACING_MAX = 64;
const DEFAULT_BRUSH: Brush = { shape: 'square', size: 1 };
const BRUSH_ANGLES = [0, 45, 90, 135] as const;

export { BRUSH_ANGLES, BRUSH_SIZE_MAX, BRUSH_SIZE_MIN, BRUSH_SPACING_MAX, BRUSH_SPACING_MIN, DEFAULT_BRUSH };
