/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Artwork } from '../model/artwork.type';
import type { TilemapId } from '../model/ids.type';
import type { Tilemap } from '../model/tilemap.type';
import { findTilemap } from './find-tilemap';

const requireTilemap = (artwork: Artwork, id: TilemapId): Tilemap => {
  const tilemap = findTilemap(artwork, id);
  if (!tilemap) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Tilemap ${id} does not exist.`);
  return tilemap;
};

export { requireTilemap };
