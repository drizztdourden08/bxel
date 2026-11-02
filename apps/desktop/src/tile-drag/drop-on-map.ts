/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { pickTile } from '../tilemap/pick-tile';
import { placeStampAt } from '../tilemap/place-stamp-at';
import { dropAssetsOnTileset } from './drop-on-tileset';
import { dropFilesOnTileset } from './drop-files-on-tileset';
import type { MapDropPayload } from './tile-drag.type';

const dropOnMap = (payload: MapDropPayload, cell: Point | null): void => {
  if ('key' in payload) {
    if (!cell) return;
    if (!useTilemapStore.getState().stamp.keys.includes(payload.key)) pickTile(payload.key);
    placeStampAt([cell]);
    return;
  }
  if ('files' in payload) void dropFilesOnTileset(payload.files);
  else dropAssetsOnTileset(payload);
};

export { dropOnMap };
