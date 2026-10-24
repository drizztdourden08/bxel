/* @layer core @kind config */
const ADVANCED_COMMAND = {
  pixelsReplace: 'pixels.replace',
  pixelsShade: 'pixels.shade',
  pixelsGradient: 'pixels.gradient',
  pixelsStamp: 'pixels.stamp',
  pixelsClear: 'pixels.clear',
  pixelsMove: 'pixels.move',
  pixelsScale: 'pixels.scale',
  pixelsRotate: 'pixels.rotate',
} as const;

const PIXELS_REPLACED = 'PIXELS_REPLACED';
const SHADE_STEPS_MAX = 255;
const SCALE_FACTOR_MAX = 64;
const ROTATE_ANGLE_MAX = 360;
const RAMP_POSITION_MAX = 255;

export { ADVANCED_COMMAND, PIXELS_REPLACED, RAMP_POSITION_MAX, ROTATE_ANGLE_MAX, SCALE_FACTOR_MAX, SHADE_STEPS_MAX };
