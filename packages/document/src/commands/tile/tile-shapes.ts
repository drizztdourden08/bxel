/* @layer core @kind logic */
import { setTileShapes } from '../../draft/set-tile-collision';
import { requireTile } from '../../read/require-tile';
import { tileShapesSchema } from '../../schema/tile-shapes-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTileset } from '../tilemap/pick-tileset';

const tileShapes = defineCommand({
  name: COMMAND_NAME.tileShapes,
  scope: 'none',
  schema: tileShapesSchema,
  run: (draft, input) => {
    const { keys, shapes, mode } = input.options;
    const tileset = pickTileset(draft, input.options.tileset);
    for (const key of keys) requireTile(tileset, key);
    setTileShapes(draft, tileset, { keys, shapes, mode, path: 'options.shapes' });
  },
});

export { tileShapes };
