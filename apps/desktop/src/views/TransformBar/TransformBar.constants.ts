/* @layer renderer-app @kind constants */
import type { ResampleAlgorithm } from '@bxel/raster';
import type { TransformField } from '../../editor/transform/transform.type';

const TRANSFORM_BAR_TEXT = {
  region: 'Transform',
  pivot: 'Pivot',
  pivotCustom: 'Custom point',
  method: 'Method',
  methodName: 'Resampling method',
  bounds: 'Overflow',
  boundsName: 'Overflow',
  tools: 'Transform tools',
  more: 'More',
  moreHint: 'Skew and pivot.',
  apply: 'Apply',
  cancel: 'Cancel',
  flipHorizontal: 'Flip horizontal',
  flipVertical: 'Flip vertical',
  turn: 'Turn 90 clockwise',
  reset: 'Reset',
  distorting: 'Distort: drag a corner freely. Reset returns to a plain transform.',
  keys: 'Drag a handle to scale, outside a corner to turn, the dot to move the pivot. Shift keeps the ratio or snaps the angle. Alt works from the pivot. Ctrl on an edge skews, Ctrl on a corner distorts. Flips and quarter turns are exact.',
} as const;

const FIELD_LABELS: Readonly<Record<TransformField, string>> = {
  x: 'X',
  y: 'Y',
  width: 'W',
  height: 'H',
  angle: 'Angle',
  skewX: 'Skew X',
  skewY: 'Skew Y',
};

const FIELD_STEPS: Readonly<Record<TransformField, number>> = {
  x: 1,
  y: 1,
  width: 1,
  height: 1,
  angle: 1,
  skewX: 1,
  skewY: 1,
};

const FIELD_RANGES: Readonly<Record<TransformField, { min: number; max: number }>> = {
  x: { min: -9999, max: 9999 },
  y: { min: -9999, max: 9999 },
  width: { min: 1, max: 9999 },
  height: { min: 1, max: 9999 },
  angle: { min: -360, max: 360 },
  skewX: { min: -80, max: 80 },
  skewY: { min: -80, max: 80 },
};

const MAIN_FIELDS: readonly TransformField[] = ['x', 'y', 'width', 'height', 'angle'];

const MORE_FIELDS: readonly TransformField[] = ['skewX', 'skewY'];

const METHOD_CHOICES: readonly ResampleAlgorithm[] = ['nearest', 'rotsprite', 'cleanedge'];

const BOUNDS_BAR_CHOICES = [
  { value: 'crop', label: 'Crop' },
  { value: 'expand', label: 'Expand' },
] as const;

const BOUNDS_BAR_NOTES: Readonly<Record<string, string>> = {
  crop: 'Pixels that leave the canvas are dropped.',
  expand: 'The canvas grows to hold the result.',
};

export { BOUNDS_BAR_CHOICES, BOUNDS_BAR_NOTES, FIELD_LABELS, FIELD_RANGES, MAIN_FIELDS, MORE_FIELDS, FIELD_STEPS, METHOD_CHOICES, TRANSFORM_BAR_TEXT };
