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
  'pixels.clear',
]);

export { PAINTING_COMMANDS };
