/* @layer renderer-app @kind constants */
const TRANSFORM_DIALOG_TEXT = {
  rotateTitle: 'Rotate',
  scaleTitle: 'Scale',
  angle: 'Angle in degrees',
  width: 'Width in pixels',
  height: 'Height in pixels',
  bounds: 'When the result does not fit',
  boundsName: 'Bounds policy',
  note: 'Nearest neighbour. The result is not lossless.',
  clipping: (value: string): string => `Clipping: ${value}`,
  cancel: 'Cancel',
  review: 'Preview on canvas',
  apply: 'Apply',
} as const;

const TRANSFORM_DIALOG_TITLES = {
  rotate: TRANSFORM_DIALOG_TEXT.rotateTitle,
  scale: TRANSFORM_DIALOG_TEXT.scaleTitle,
} as const;

export { TRANSFORM_DIALOG_TEXT, TRANSFORM_DIALOG_TITLES };
