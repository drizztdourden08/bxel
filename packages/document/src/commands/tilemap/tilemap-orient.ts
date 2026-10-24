/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { requireTileset } from '../../read/require-tileset';
import { tilemapOrientSchema } from '../../schema/tilemap-orient-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { normalizeOrientation } from './normalize-orientation';
import { pickTilemap } from './pick-tilemap';

const tilemapOrient = defineCommand({
  name: COMMAND_NAME.tilemapOrient,
  scope: 'none',
  schema: tilemapOrientSchema,
  run: (draft, input) => {
    const tilemap = pickTilemap(draft, input.options.tilemap);
    const tileset = requireTileset(draft.artwork, tilemap.tilesetId);
    const orientation = normalizeOrientation(input.options.orientation, tileset, 'options.orientation');
    updateTilemap(draft, tilemap.id, (current) => {
      const { orientation: dropped, ...rest } = current;
      return orientation ? { ...rest, orientation } : rest;
    });
  },
});

export { tilemapOrient };
