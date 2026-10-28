/* @layer renderer-app @kind constants */
import type { BoundsPolicy, ResampleAlgorithm } from '@bxel/raster';
import type { TransformField } from '../../editor/transform/transform.type';

const TRANSFORM_BAR_TEXT = {
  region: 'Transform',
  title: 'Transform',
  pivot: 'Pivot',
  pivotCustom: 'The pivot is off the nine presets',
  method: 'Method',
  methodName: 'Resampling method',
  bounds: 'If it does not fit',
  boundsName: 'Bounds policy',
  flipHorizontal: 'Flip horizontal',
  flipVertical: 'Flip vertical',
  turn: 'Turn 90',
  reset: 'Reset',
  distorting: 'Distort: drag a corner freely. Reset returns to a plain transform.',
  keys: 'Shift keeps the ratio or snaps the angle. Alt works from the pivot. Ctrl on an edge skews, Ctrl on a corner distorts.',
  exactNote: 'Flips and quarter turns are always exact.',
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

const FIELD_ROWS: readonly (readonly TransformField[])[] = [
  ['x', 'y', 'width', 'height'],
  ['angle', 'skewX', 'skewY'],
];

const METHOD_CHOICES: readonly ResampleAlgorithm[] = ['nearest', 'rotsprite', 'cleanedge'];

const BOUNDS_BAR_LABELS: Readonly<Record<BoundsPolicy, string>> = {
  crop: 'Crop',
  expand: 'Expand canvas',
  cancel: 'Cancel',
};

export { BOUNDS_BAR_LABELS, FIELD_LABELS, FIELD_ROWS, FIELD_STEPS, METHOD_CHOICES, TRANSFORM_BAR_TEXT };
