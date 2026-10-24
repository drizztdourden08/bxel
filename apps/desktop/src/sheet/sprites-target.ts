/* @layer renderer-app @kind logic */
import type { SpriteId, TargetScope } from '@bxel/document';

const spritesTarget = (ids: readonly SpriteId[]): TargetScope => ({
  sprites: [...ids],
  layers: { by: 'all' },
  frames: { by: 'all' },
});

export { spritesTarget };
