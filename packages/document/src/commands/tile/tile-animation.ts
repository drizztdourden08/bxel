/* @layer core @kind logic */
import { setTileAnimation } from '../../draft/set-tile-animation';
import { requireTile } from '../../read/require-tile';
import { tileAnimationSchema } from '../../schema/tile-animation-schema';
import { pickAnimation } from '../animation/pick-animation';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTileset } from '../tilemap/pick-tileset';

const tileAnimation = defineCommand({
  name: COMMAND_NAME.tileAnimation,
  scope: 'none',
  schema: tileAnimationSchema,
  run: (draft, input) => {
    const { key, change } = input.options;
    const tileset = pickTileset(draft, input.options.tileset);
    requireTile(tileset, key);
    if (change.kind === 'clear') {
      setTileAnimation(draft, tileset, { key, animation: undefined });
      return;
    }
    const animation = pickAnimation(draft, change.animation);
    setTileAnimation(draft, tileset, { key, animation: { animationId: animation.id, tagId: change.tag, start: change.start } });
  },
});

export { tileAnimation };
