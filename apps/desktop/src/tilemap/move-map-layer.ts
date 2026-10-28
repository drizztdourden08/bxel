/* @layer renderer-app @kind logic */
import { layerPosition } from '../editor/layer-position';
import { currentMap } from './current-map';
import { reorderMapLayer } from './reorder-map-layer';

const moveMapLayer = (by: 1 | -1, layerId?: string): boolean => {
  const target = currentMap();
  const place = target ? layerPosition(target.tilemap.layers, layerId ?? target.layer.id) : null;
  if (!place) return false;
  const to = place.from - by;
  return to >= 0 && to < place.total && reorderMapLayer(place.from, to);
};

export { moveMapLayer };
