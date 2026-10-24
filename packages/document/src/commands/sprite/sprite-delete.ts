/* @layer core @kind logic */
import { prunePresets } from '../../draft/prune-presets';
import { removeFromSheets } from '../../draft/remove-from-sheets';
import { removeSprites } from '../../draft/remove-sprites';
import { findSprite } from '../../read/find-sprite';
import { spriteDeleteSchema } from '../../schema/sprite-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const spriteDelete = defineCommand({
  name: COMMAND_NAME.spriteDelete,
  scope: 'sprites',
  schema: spriteDeleteSchema,
  run: (draft, input) => {
    const gone = new Set(input.sprites);
    const tile = draft.artwork.tilesets.flatMap((tileset) => tileset.tiles).find((item) => gone.has(item.spriteId));
    if (tile) {
      const name = findSprite(draft.artwork, tile.spriteId)?.name ?? tile.spriteId;
      throw fail(ERROR_CODE.TILE_IN_USE, `Sprite "${name}" is a tile of a tileset. Delete the tile first.`);
    }
    const left = draft.artwork.sprites.filter((sprite) => sprite.role === 'sprite' && !gone.has(sprite.id));
    if (left.length === 0) throw fail(ERROR_CODE.LAST_SPRITE, 'A file keeps at least one sprite.');
    removeFromSheets(draft, gone);
    removeSprites(draft, gone);
    prunePresets(draft, gone);
  },
});

export { spriteDelete };
