/* @layer core @kind logic */
import { removeSprites } from '../../draft/remove-sprites';
import { updateArtwork } from '../../draft/update-artwork';
import { tilesetDeleteSchema } from '../../schema/tileset-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickTileset } from '../tilemap/pick-tileset';

const tilesetDelete = defineCommand({
  name: COMMAND_NAME.tilesetDelete,
  scope: 'none',
  schema: tilesetDeleteSchema,
  run: (draft, input) => {
    const tileset = pickTileset(draft, input.options.tileset);
    const users = draft.artwork.tilemaps.filter((tilemap) => tilemap.tilesetId === tileset.id);
    if (users.length > 0) {
      const names = users.map((tilemap) => `"${tilemap.name}"`).join(', ');
      throw fail(ERROR_CODE.TILESET_IN_USE, `Tileset "${tileset.name}" is used by tilemap ${names}. Delete those first.`);
    }
    updateArtwork(draft, (artwork) => ({
      ...artwork,
      tilesets: artwork.tilesets.filter((item) => item.id !== tileset.id),
    }));
    removeSprites(draft, new Set(tileset.tiles.map((tile) => tile.spriteId)));
  },
});

export { tilesetDelete };
