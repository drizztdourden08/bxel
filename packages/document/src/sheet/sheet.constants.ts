/* @layer core @kind config */
import type { Point, Size } from '../model/geometry.type';

const EMPTY_SIZE: Size = { width: 0, height: 0 };

const NO_SPACING: Point = { x: 0, y: 0 };

const MAX_OVERLAP_WARNINGS = 32;

export { EMPTY_SIZE, MAX_OVERLAP_WARNINGS, NO_SPACING };
