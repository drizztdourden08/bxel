/* @layer renderer-app @kind logic */
import { currentArtwork } from '../sheet/current-artwork';
import { useTilemapStore } from '../stores/useTilemapStore';
import { mapTarget } from './map-target';
import { resolveMap } from './resolve-map';
import type { MapTarget } from './tilemap.type';

const currentMap = (): MapTarget | null => {
  const artwork = currentArtwork();
  if (!artwork) return null;
  const { tilesetId, mapId, layerId } = useTilemapStore.getState();
  return mapTarget(resolveMap(artwork, { tilesetId, mapId, layerId }));
};

export { currentMap };
