/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { Tileset } from '../../model/tilemap.type';
import { requireTile } from '../../read/require-tile';
import type { TileRef } from '../../schema/command-options.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const resolveTileKey = (draft: Draft, tileset: Tileset, tile: TileRef): number => {
  if (typeof tile === 'number') return requireTile(tileset, tile).key;
  const spriteId = draft.created[tile.ref];
  const found = tileset.tiles.find((item) => item.spriteId === spriteId);
  if (!found) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `The ref "${tile.ref}" is not a tile of tileset "${tileset.name}".`, {
      path: 'options.tile',
    });
  }
  return found.key;
};

export { resolveTileKey };
