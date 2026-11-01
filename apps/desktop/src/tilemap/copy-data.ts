/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { heldTileData } from './held-tile-data';
import { tileOf } from './tile-of';
import { TILE_LABEL } from './tilemap.constants';

const copyData = (key?: number): boolean => {
  const tile = tileOf(key);
  if (tile === null) return false;
  heldTileData.patch = { type: tile.type ?? null, probability: tile.probability ?? null, turns: tile.turns ?? null, data: tile.data ?? {} };
  useNoticeStore.getState().post(TILE_LABEL.copiedData);
  return true;
};

export { copyData };
