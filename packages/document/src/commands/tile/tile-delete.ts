/* @layer core @kind logic */
import { rekeyTilesetMaps } from '../../draft/rekey-tileset-maps';
import { removeSprites } from '../../draft/remove-sprites';
import { updateTileset } from '../../draft/update-tileset';
import { requireTile } from '../../read/require-tile';
import { tileUseCounts } from '../../read/tile-use-counts';
import { tileDeleteSchema } from '../../schema/tile-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickTileset } from '../tilemap/pick-tileset';

const tileDelete = defineCommand({
  name: COMMAND_NAME.tileDelete,
  scope: 'none',
  schema: tileDeleteSchema,
  run: (draft, input) => {
    const { key, replacement } = input.options;
    const tileset = pickTileset(draft, input.options.tileset);
    const tile = requireTile(tileset, key);
    if (replacement === key) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'The replacement must be another tile.', { path: 'options.replacement' });
    }
    if (replacement !== undefined && replacement !== 0) requireTile(tileset, replacement);
    const uses = tileUseCounts(draft.artwork, tileset.id).get(key) ?? 0;
    if (uses > 0 && replacement === undefined) {
      throw fail(
        ERROR_CODE.TILE_IN_USE,
        `${uses} map cells use tile ${key}. Give a replacement key, or 0 to clear them.`,
        { path: 'options.replacement' },
      );
    }
    if (uses > 0 && replacement !== undefined) rekeyTilesetMaps(draft, tileset.id, { from: key, to: replacement });
    updateTileset(draft, tileset.id, (current) => ({
      ...current,
      tiles: current.tiles.filter((item) => item.key !== key),
    }));
    removeSprites(draft, new Set([tile.spriteId]));
  },
});

export { tileDelete };
