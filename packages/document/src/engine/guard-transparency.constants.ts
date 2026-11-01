/* @layer core @kind config */
const PAINTING_COMMANDS: ReadonlySet<string> = new Set([
  'pixels.patch',
  'pixels.paint',
  'pixels.erase',
  'pixels.fill',
  'pixels.shape',
  'pixels.replace',
  'pixels.shade',
  'pixels.gradient',
  'pixels.stamp',
  'pixels.plot',
  'pixels.outline',
  'pixels.clear',
]);

const MOVING_COMMANDS: ReadonlySet<string> = new Set([
  'pixels.move',
  'pixels.scale',
  'pixels.rotate',
  'pixels.transform',
  'pixels.distort',
  'pixels.flip',
  'pixels.turn',
]);

export { MOVING_COMMANDS, PAINTING_COMMANDS };
