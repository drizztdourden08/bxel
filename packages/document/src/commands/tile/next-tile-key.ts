/* @layer core @kind logic */
import type { Tileset } from '../../model/tilemap.type';
import { MAX_TILESET_TILES } from '../../model/tilemap-limits.constants';
import { MAX_TILE_KEY } from '../../schema/tileset-schema.constants';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const nextTileKey = (tileset: Tileset): number => {
  if (tileset.tiles.length >= MAX_TILESET_TILES || tileset.nextKey > MAX_TILE_KEY) {
    throw fail(ERROR_CODE.LIMIT_REACHED, `A tileset holds at most ${MAX_TILESET_TILES} tiles.`);
  }
  return tileset.nextKey;
};

export { nextTileKey };
