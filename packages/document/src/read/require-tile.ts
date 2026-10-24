/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Tile, Tileset } from '../model/tilemap.type';
import { findTile } from './find-tile';

const requireTile = (tileset: Tileset, key: number): Tile => {
  const tile = findTile(tileset, key);
  if (!tile) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Tileset "${tileset.name}" has no tile with key ${key}.`);
  return tile;
};

export { requireTile };
