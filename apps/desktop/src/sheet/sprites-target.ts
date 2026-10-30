/* @layer renderer-app @kind logic */
import type { SpriteRef, TargetScope } from '@bxel/document';

const spritesTarget = (ids: readonly SpriteRef[]): TargetScope => ({
  sprites: [...ids],
  layers: { by: 'all' },
  frames: { by: 'all' },
});

export { spritesTarget };
