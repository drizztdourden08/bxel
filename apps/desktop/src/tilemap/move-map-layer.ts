/* @layer renderer-app @kind logic */
import { currentMap } from './current-map';
import { reorderMapLayer } from './reorder-map-layer';

/** Moves a map layer one step towards the top (1) or the bottom (-1). Without an id it is the active layer. */
const moveMapLayer = (by: 1 | -1, layerId?: string): boolean => {
  const target = currentMap();
  if (!target) return false;
  const { layers } = target.tilemap;
  const at = layers.findIndex((each) => each.id === (layerId ?? target.layer.id));
  const to = at + by;
  if (at < 0 || to < 0 || to >= layers.length) return false;
  return reorderMapLayer(layers.length - 1 - at, layers.length - 1 - to);
};

/** Moves a map layer to the top or the bottom of the list. Without an id it is the active layer. */
const moveMapLayerToEdge = (edge: 'top' | 'bottom', layerId?: string): boolean => {
  const target = currentMap();
  if (!target) return false;
  const { layers } = target.tilemap;
  const at = layers.findIndex((each) => each.id === (layerId ?? target.layer.id));
  const from = layers.length - 1 - at;
  return at >= 0 && reorderMapLayer(from, edge === 'top' ? 0 : layers.length - 1);
};

export { moveMapLayer, moveMapLayerToEdge };
