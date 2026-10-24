/* @layer renderer-app @kind logic */
import type { Tileset } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { useTilemapStore } from '../stores/useTilemapStore';
import { resolveMap } from './resolve-map';

const currentTileset = (): Tileset | null => {
  const artwork = currentArtwork();
  if (!artwork) return null;
  const { tilesetId, mapId, layerId } = useTilemapStore.getState();
  return resolveMap(artwork, { tilesetId, mapId, layerId }).tileset;
};

export { currentTileset };
