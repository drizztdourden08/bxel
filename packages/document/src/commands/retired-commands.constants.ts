/* @layer core @kind config */
const RETIRED_COMMANDS: ReadonlySet<string> = new Set([
  'frame.add',
  'frame.delete',
  'frame.duplicate',
  'frame.reorder',
  'frame.update',
  'tag.add',
  'tag.update',
  'tag.delete',
  'cel.clear',
  'cel.copy',
  'cel.move',
  'cel.link',
  'cel.unlink',
  'sprite.merge',
  'sprite.split',
]);

const RETIRED_MESSAGE = 'Sprites are still images. Use an animation for frames.';

export { RETIRED_COMMANDS, RETIRED_MESSAGE };
