/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { firstTileLayer } from './first-tile-layer';

const activateMapLayer = (id: string): void => {
  const target = currentMap();
  const tile = target ? firstTileLayer(target.tilemap.layers, id) : null;
  if (tile !== null) useTilemapStore.getState().setLayer(tile);
};

export { activateMapLayer };
