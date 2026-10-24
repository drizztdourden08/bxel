/* @layer renderer-app @kind logic */
import type { FieldRange } from './clamp-field.type';

const clampField = (value: number, range: FieldRange): number =>
  Number.isFinite(value) ? Math.max(range.min, Math.min(range.max, Math.round(value))) : range.min;

export { clampField };
