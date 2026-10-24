/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Artwork } from '../model/artwork.type';
import type { TilesetId } from '../model/ids.type';
import type { Tileset } from '../model/tilemap.type';
import { findTileset } from './find-tileset';

const requireTileset = (artwork: Artwork, id: TilesetId): Tileset => {
  const tileset = findTileset(artwork, id);
  if (!tileset) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Tileset ${id} does not exist.`);
  return tileset;
};

export { requireTileset };
