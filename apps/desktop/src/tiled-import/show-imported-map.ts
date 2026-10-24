/* @layer renderer-app @kind logic */
import type { TilemapId, TilesetId } from '@bxel/document';
import { switchMode } from '../sheet/switch-mode';
import { useTilemapStore } from '../stores/useTilemapStore';
import { TILED_REF } from './tiled-import.constants';

const showImportedMap = (created: Readonly<Record<string, string>>): void => {
  switchMode('tilemap');
  const tileset = created[TILED_REF.tileset];
  const tilemap = created[TILED_REF.tilemap];
  if (tileset !== undefined) useTilemapStore.getState().setTileset(tileset as TilesetId);
  if (tilemap !== undefined) useTilemapStore.getState().setMap(tilemap as TilemapId);
};

export { showImportedMap };
