/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import { tilemapDeleteSchema } from '../../schema/tilemap-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTilemap } from './pick-tilemap';

const tilemapDelete = defineCommand({
  name: COMMAND_NAME.tilemapDelete,
  scope: 'none',
  schema: tilemapDeleteSchema,
  run: (draft, input) => {
    const tilemap = pickTilemap(draft, input.options.tilemap);
    updateArtwork(draft, (artwork) => ({
      ...artwork,
      tilemaps: artwork.tilemaps.filter((item) => item.id !== tilemap.id),
    }));
  },
});

export { tilemapDelete };
