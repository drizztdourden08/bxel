/* @layer renderer-app @kind logic */
import { layerPosition } from '../editor/layer-position';
import { currentMap } from './current-map';
import { reorderMapLayer } from './reorder-map-layer';

const moveMapLayerToEdge = (edge: 'top' | 'bottom', layerId?: string): boolean => {
  const target = currentMap();
  const place = target ? layerPosition(target.tilemap.layers, layerId ?? target.layer.id) : null;
  return place !== null && reorderMapLayer(place.from, edge === 'top' ? 0 : place.total - 1);
};

export { moveMapLayerToEdge };
