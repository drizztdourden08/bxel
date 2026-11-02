/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { firstUse } from './first-use';
import { mapCanvas } from './map-canvas';
import type { NeighbourSource } from './tilemap.type';

const neighbourSource = (): NeighbourSource | null => {
  const { editMode, editKey } = useTilemapStore.getState();
  const map = editMode === 'edit' && editKey !== null ? currentMap() : null;
  const at = map && editKey !== null ? firstUse(map.tilemap, editKey) : null;
  const canvas = map && at ? mapCanvas(map.artwork, map.tilemap) : null;
  if (!map || !at || !canvas) return null;
  const { tilemap, tileset } = map;
  return { canvas, at, columns: tilemap.columns, rows: tilemap.rows, tileWidth: tileset.tileWidth, tileHeight: tileset.tileHeight };
};

export { neighbourSource };
