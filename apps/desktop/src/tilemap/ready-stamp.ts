/* @layer renderer-app @kind logic */
import type { TileStamp } from '../stores/tilemap-store.type';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { TILEMAP_TEXT } from './tilemap.constants';
import type { MapTarget } from './tilemap.type';
import { usableStamp } from './usable-stamp';

const readyStamp = (target: MapTarget): TileStamp | null => {
  const stamp = usableStamp(useTilemapStore.getState().stamp, target.tileset);
  if (stamp.keys.some((key) => key !== 0)) return stamp;
  useNoticeStore.getState().post(TILEMAP_TEXT.noTile);
  return null;
};

export { readyStamp };
