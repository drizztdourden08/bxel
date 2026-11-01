/* @layer renderer-app @kind logic */
import { heldTileData } from './held-tile-data';
import { setTileData } from './set-tile-data';
import { targetKeys } from './target-keys';
import { tileOf } from './tile-of';
import { TILE_LABEL } from './tilemap.constants';

const pasteData = (key?: number): boolean => {
  const tile = tileOf(key);
  const held = heldTileData.patch;
  return tile === null || held === null ? false : setTileData(targetKeys(tile), held, TILE_LABEL.pasteData);
};

export { pasteData };
