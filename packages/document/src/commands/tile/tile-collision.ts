/* @layer core @kind logic */
import { setTileCollision } from '../../draft/set-tile-collision';
import { requireTile } from '../../read/require-tile';
import { tileCollisionSchema } from '../../schema/tile-collision-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTileset } from '../tilemap/pick-tileset';

const tileCollision = defineCommand({
  name: COMMAND_NAME.tileCollision,
  scope: 'none',
  schema: tileCollisionSchema,
  run: (draft, input) => {
    const { key, shape } = input.options;
    const tileset = pickTileset(draft, input.options.tileset);
    requireTile(tileset, key);
    setTileCollision(draft, tileset, { key, collision: shape.kind === 'none' ? undefined : shape, path: 'options.shape' });
  },
});

export { tileCollision };
