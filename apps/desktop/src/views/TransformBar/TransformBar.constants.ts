/* @layer renderer-app @kind constants */
import type { BoundsPolicy, ResampleAlgorithm } from '@bxel/raster';
import type { PivotAnchor } from '../../editor/transform/pivot-anchor.type';
import type { TransformField } from '../../editor/transform/transform.type';

const TRANSFORM_BAR_TEXT = {
  region: 'Transform',
  pivot: 'Pivot',
  pivotCustom: 'Custom point',
  method: 'Method',
  methodName: 'Resampling method',
  bounds: 'Overflow',
  boundsName: 'Bounds policy',
  flipHorizontal: 'Flip H',
  flipVertical: 'Flip V',
  turn: 'Turn 90',
  reset: 'Reset',
  distorting: 'Distort: drag a corner freely. Reset returns to a plain transform.',
  keys: 'Drag a handle to scale, outside a corner to turn, the dot to move the pivot. Shift keeps the ratio or snaps the angle. Alt works from the pivot. Ctrl on an edge skews, Ctrl on a corner distorts. Flips and quarter turns are exact.',
} as const;

const CUSTOM_PIVOT = 'custom';

const ANCHOR_LABELS: Readonly<Record<PivotAnchor, string>> = {
  'top-left': 'Top left',
  top: 'Top',
  'top-right': 'Top right',
  left: 'Left',
  center: 'Centre',
  right: 'Right',
  'bottom-left': 'Bottom left',
  bottom: 'Bottom',
  'bottom-right': 'Bottom right',
};

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

export { ANCHOR_LABELS, FIELD_RANGES, BOUNDS_BAR_LABELS, CUSTOM_PIVOT, FIELD_LABELS, FIELD_ROWS, FIELD_STEPS, METHOD_CHOICES, TRANSFORM_BAR_TEXT };
