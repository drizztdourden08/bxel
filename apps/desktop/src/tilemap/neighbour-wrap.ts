/* @layer renderer-app @kind logic */
import type { Wrap } from '@bxel/raster';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { firstUse } from './first-use';
import { sameTileAt } from './same-tile-at';

const neighbourWrap = (): Wrap => {
  const { editMode, editKey } = useTilemapStore.getState();
  const map = editMode === 'edit' && editKey !== null ? currentMap() : null;
  const at = map && editKey !== null ? firstUse(map.tilemap, editKey) : null;
  if (!map || !at || editKey === null) return { x: false, y: false };
  const same = (dx: number, dy: number): boolean => sameTileAt(map.tilemap, editKey, { x: at.x + dx, y: at.y + dy });
  return { x: same(-1, 0) || same(1, 0), y: same(0, -1) || same(0, 1) };
};

export { neighbourWrap };
